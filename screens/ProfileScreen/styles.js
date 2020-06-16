import EStyleSheet from 'react-native-extended-stylesheet';
import { width } from '../../utils/Scalaing';

export const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: width > 768 ? '20%' : 0,
  },
  cardNumberTextContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardNumberText: {
    width: '100%',
    paddingLeft: 20,
    fontSize: '$s',
  },
  cardNumberSelectedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: 10,
  },
  image: {
    flex: 1,
    height: null,
    width: null,
  },
  userName: {
    fontSize: '$xl',
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  card: {
    padding: '1rem',
    borderBottomWidth: 1,
    borderBottomColor: '#dedede',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: '$l',
  },
  default: {
    fontSize: '$xs',
    color: 'gray',
  },
  content: {
    flexDirection: 'row',
  },
});
