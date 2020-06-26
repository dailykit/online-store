import EStyleSheet from 'react-native-extended-stylesheet';
import { height, width } from '../../utils/Scalaing';

export const styles = EStyleSheet.create({
  img_container: {
    height: width > 768 ? height * 0.6 : height * 0.25,
    width,
  },
  reallyBigContainer: {
    width: width,
    marginHorizontal: 'auto',
    backgroundColor: '#eaeded',
  },
  cover_image: {
    flex: 1,
    resizeMode: 'cover',
    height: null,
    width: null,
    aspectRatio: 3 / 2,
  },
  picker_container: {
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    width: width,
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  picker_placeholder: {
    flex: 1,
    justifyContent: 'center',
  },
  flexContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: '$m',
    padding: 10,
    fontWeight: 'bold',
  },
  dateTitle: {
    width: width * 0.5,
    fontWeight: 'bold',
    paddingLeft: 20,
    fontSize: '$l',
  },
  optionStyle: {
    fontSize: '$s',
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
  },
  header: {
    fontSize: '$l',
    fontWeight: 'bold',
    paddingLeft: '2rem',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
  },
  selectStyle: {
    transitionProperty: 'opacity',
    transitionDuration: '0.15s',
    userSelect: 'none',
    cursor: 'pointer',
    touchAction: 'manipulation',
    outlineWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderColor: '#E4E9F2',
    backgroundColor: '#F7F9FC',
    borderRadius: 4,
    borderWidth: 1,
    minHeight: 40,
    paddingVertical: 7,
  },
  category: {
    backgroundColor: '#fff',
    marginHorizontal: width > 768 ? 20 : 0,
    marginVertical: width > 768 ? 20 : 5,
    borderRadius: 2,
  },
  sections: {
    marginBottom: height * 0.1,
  },
});
