import EStyleSheet from 'react-native-extended-stylesheet';
import { height, width } from '../../utils/Scalaing';

export const styles = EStyleSheet.create({
  item_container: {
    flexDirection: 'column',
    paddingBottom: 5,
    marginBottom: 2,
    paddingBottom: 20,
    paddingHorizontal: 10,
    marginTop: 4,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#fff',
  },
  item_container_one: {
    flex: 4,
    paddingTop: 20,
    height: height * 0.3,
  },
  item_container_three: {
    flex: 2,
    paddingTop: 15,
  },
  item_image: {
    flex: 1,
    height: null,
    width: null,
    resizeMode: 'contain',
  },
  item_chef: {
    fontSize: 18,
    color: '#4f4e4e',
    flex: 1,
    textAlign: 'right',
  },
  item_container_two: {
    flex: 1.3,
    paddingTop: 15,
    paddingHorizontal: 10,
    justifyContent: 'center',
    paddingTop: 15,
    paddingLeft: 10,
  },
  item_title: {
    fontSize: '$l',
  },
  item_three_lower: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  item_details: {
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: '$s',
    flex: 1,
  },
  item_chef: {
    fontSize: 18,
    color: '#4f4e4e',
    flex: 1,
    textAlign: 'right',
  },
  type_container_right: {
    flexDirection: 'row',
  },
  type_button: {
    backgroundColor: '#fff',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#efefef',
  },
  type_text: {
    fontWeight: 'bold',
  },
  done_container: {
    marginLeft: 8,
    borderRadius: '50%',
  },
});
