import { rrulestr } from 'rrule';

export const getMinutes = (time) => {
  return parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
};

export const makeDoubleDigit = (num) => {
  if (num.toString().length === 1) {
    return '0' + num;
  } else {
    return num;
  }
};

export const getTimeFromMinutes = (num) => {
  const hours = num / 60;
  const rhours = Math.floor(hours);
  const minutes = (hours - rhours) * 60;
  const rminutes = Math.round(minutes);
  return rhours + ':' + makeDoubleDigit(rminutes);
};

export const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

export const getDistance = (lat1, lon1, lat2, lon2) => {
  let R = 6371; // Radius of the earth in km
  let dLat = deg2rad(lat2 - lat1); // deg2rad below
  let dLon = deg2rad(lon2 - lon1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c * 0.621; // Distance in miles
  return d;
};

export const generateMiniSlots = (data, size) => {
  let newData = [];
  data.forEach((el) => {
    el.slots.forEach((slot) => {
      const startMinutes = getMinutes(slot.start);
      const endMinutes = getMinutes(slot.end);
      let startPoint = startMinutes;
      while (startPoint < endMinutes) {
        const index = newData.findIndex((datum) => datum.date === el.date);
        if (index === -1) {
          newData.push({
            date: el.date,
            slots: [{ time: getTimeFromMinutes(startPoint), ...slot }],
          });
        } else {
          newData[index].slots.push({
            time: getTimeFromMinutes(startPoint),
            ...slot,
          });
        }
        startPoint = startPoint + size;
      }
    });
  });
  return newData;
};

export const isPickUpAvailable = (recurrences) => {
  for (let rec of recurrences) {
    const now = new Date(); // now
    const start = new Date(now.getTime() - 1000 * 60 * 60 * 24); // yesterday
    const end = new Date(now.getTime() + 1000 * 60 * 60 * 24); // tomorrow
    const dates = rrulestr(rec.rrule).between(start, now);
    if (dates.length) {
      if (rec.timeSlots.length) {
        for (let timeslot of rec.timeSlots) {
          const timeslotFromArr = timeslot.from.split(':');
          const timeslotToArr = timeslot.to.split(':');
          const fromTimeStamp = new Date(now.getTime());
          fromTimeStamp.setHours(
            timeslotFromArr[0],
            timeslotFromArr[1],
            timeslotFromArr[2]
          );
          const toTimeStamp = new Date(now.getTime());
          toTimeStamp.setHours(
            timeslotToArr[0],
            timeslotToArr[1],
            timeslotToArr[2]
          );
          // check if current time falls within time slot
          if (
            now.getTime() > fromTimeStamp.getTime() &&
            now.getTime() < toTimeStamp.getTime()
          ) {
            return { status: true };
          } else {
            return { status: false };
          }
        }
      } else {
        return { status: false };
      }
    } else {
      return { status: false };
    }
  }
};

export const generatePickUpSlots = (recurrences) => {
  let data = [];
  recurrences.forEach((rec) => {
    const now = new Date(); // now
    const start = new Date(now.getTime() - 1000 * 60 * 60 * 24); // yesterday
    // const start = now;
    const end = new Date(now.getTime() + 7 * 1000 * 60 * 60 * 24); // 7 days later
    const dates = rrulestr(rec.rrule).between(start, end);
    dates.forEach((date) => {
      if (rec.timeSlots.length) {
        rec.timeSlots.forEach((timeslot) => {
          const timeslotFromArr = timeslot.from.split(':');
          const timeslotToArr = timeslot.to.split(':');
          const fromTimeStamp = new Date(
            date.setHours(
              timeslotFromArr[0],
              timeslotFromArr[1],
              timeslotFromArr[2]
            )
          );
          const toTimeStamp = new Date(
            date.setHours(timeslotToArr[0], timeslotToArr[1], timeslotToArr[2])
          );
          // start + lead time < to
          const leadMiliSecs = timeslot.pickUpLeadTime * 60000;
          if (now.getTime() + leadMiliSecs < toTimeStamp.getTime()) {
            // if start + lead time > from -> set new from time
            let slotStart;
            let slotEnd =
              toTimeStamp.getHours() + ':' + toTimeStamp.getMinutes();
            if (now.getTime() + leadMiliSecs > fromTimeStamp.getTime()) {
              // new start time = lead time + now
              const newStartTimeStamp = new Date(now.getTime() + leadMiliSecs);
              slotStart =
                newStartTimeStamp.getHours() +
                ':' +
                newStartTimeStamp.getMinutes();
            } else {
              slotStart =
                fromTimeStamp.getHours() + ':' + fromTimeStamp.getMinutes();
            }
            // check if date already in slots
            const dateWithoutTime = date.toDateString();
            const index = data.findIndex(
              (slot) => slot.date === dateWithoutTime
            );
            if (index === -1) {
              data.push({
                date: dateWithoutTime,
                slots: [
                  {
                    start: slotStart,
                    end: slotEnd,
                  },
                ],
              });
            } else {
              data[index].slots.push({
                start: slotStart,
                end: slotEnd,
              });
            }
          }
        });
      } else {
        return { status: false };
      }
    });
  });
  return { status: true, data };
};

export const isDeliveryAvailable = (recurrences) => {
  for (let rec of recurrences) {
    const now = new Date(); // now
    const start = new Date(now.getTime() - 1000 * 60 * 60 * 24); // yesterday
    const end = new Date(now.getTime() + 1000 * 60 * 60 * 24); // tomorrow
    const dates = rrulestr(rec.rrule).between(start, now);
    if (dates.length) {
      if (rec.timeSlots.length) {
        for (let timeslot of rec.timeSlots) {
          if (timeslot.mileRanges.length) {
            const timeslotFromArr = timeslot.from.split(':');
            const timeslotToArr = timeslot.to.split(':');
            const fromTimeStamp = new Date(now.getTime());
            fromTimeStamp.setHours(
              timeslotFromArr[0],
              timeslotFromArr[1],
              timeslotFromArr[2]
            );
            const toTimeStamp = new Date(now.getTime());
            toTimeStamp.setHours(
              timeslotToArr[0],
              timeslotToArr[1],
              timeslotToArr[2]
            );
            // check if current time falls within time slot
            if (
              now.getTime() > fromTimeStamp.getTime() &&
              now.getTime() < toTimeStamp.getTime()
            ) {
              return { status: true, mileRangeId: timeslot.mileRanges[0].id };
            } else {
              return { status: false };
            }
          }
        }
      } else {
        return { status: false };
      }
    } else {
      return { status: false };
    }
  }
};

export const generateDeliverySlots = (recurrences) => {
  let data = [];
  recurrences.forEach((rec) => {
    const now = new Date(); // now
    const start = new Date(now.getTime() - 1000 * 60 * 60 * 24); // yesterday
    // const start = now;
    const end = new Date(now.getTime() + 7 * 1000 * 60 * 60 * 24); // 7 days later
    const dates = rrulestr(rec.rrule).between(start, end);
    dates.forEach((date) => {
      if (rec.timeSlots.length) {
        rec.timeSlots.forEach((timeslot) => {
          // if multiple mile ranges, only first one will be taken
          if (timeslot.mileRanges.length) {
            const leadTime = timeslot.mileRanges[0].leadTime;
            const timeslotFromArr = timeslot.from.split(':');
            const timeslotToArr = timeslot.to.split(':');
            const fromTimeStamp = new Date(
              date.setHours(
                timeslotFromArr[0],
                timeslotFromArr[1],
                timeslotFromArr[2]
              )
            );
            const toTimeStamp = new Date(
              date.setHours(
                timeslotToArr[0],
                timeslotToArr[1],
                timeslotToArr[2]
              )
            );
            // start + lead time < to
            const leadMiliSecs = leadTime * 60000;
            if (now.getTime() + leadMiliSecs < toTimeStamp.getTime()) {
              // if start + lead time > from -> set new from time
              let slotStart;
              let slotEnd =
                toTimeStamp.getHours() + ':' + toTimeStamp.getMinutes();
              if (now.getTime() + leadMiliSecs > fromTimeStamp.getTime()) {
                // new start time = lead time + now
                const newStartTimeStamp = new Date(
                  now.getTime() + leadMiliSecs
                );
                slotStart =
                  newStartTimeStamp.getHours() +
                  ':' +
                  newStartTimeStamp.getMinutes();
              } else {
                slotStart =
                  fromTimeStamp.getHours() + ':' + fromTimeStamp.getMinutes();
              }
              // check if date already in slots
              const dateWithoutTime = date.toDateString();
              const index = data.findIndex(
                (slot) => slot.date === dateWithoutTime
              );
              if (index === -1) {
                data.push({
                  date: dateWithoutTime,
                  slots: [
                    {
                      start: slotStart,
                      end: slotEnd,
                      mileRangeId: timeslot.mileRanges[0].id,
                    },
                  ],
                });
              } else {
                data[index].slots.push({
                  start: slotStart,
                  end: slotEnd,
                  mileRangeId: timeslot.mileRanges[0].id,
                });
              }
            }
          }
        });
      } else {
        return { status: false };
      }
    });
  });
  return { status: true, data };
};
