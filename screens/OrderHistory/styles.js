import EStyleSheet from 'react-native-extended-stylesheet';
import { width } from '../../utils/Scalaing';

export const styles = EStyleSheet.create({
  heading: {
    fontSize: '$l',
    fontWeight: 'bold',
    padding: 12,
    color: '#666',
    paddingHorizontal: width > 768 ? '20%' : 12,
  },
  outerContainer: {
    marginTop: width > 768 ? 20 : 5,
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: width > 768 ? '20%' : 0,
  },
  card: {
    padding: width > 768 ? 0 : 12,
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  head: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  status: {
    backgroundColor: '#aaa',
    color: '#fff',
    borderRadius: 2,
    padding: 5,
  },
  title: {
    fontWeight: 'bold',
    fontSize: '$m',
  },
  muted: {
    color: 'gray',
    fontSize: '$s',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  lite: {
    fontWeight: 'normal',
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  total: {
    fontWeight: 'bold',
    fontSize: '$m',
    marginTop: 10,
  },
  header: {
    backgroundColor: '#fff',
  },
  rowContainer: {
    flex: 1,
    width: '100%',
  },
  row: {
    marginBottom: 5,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  product: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    flex: 1,
    marginBottom: 10,
    width: '100%',
  },
  productInfo: {
    fontSize: '$s',
    flex: 1,
  },
  productOption: {
    fontSize: '$xs',
    color: '#666',
  },
  productPrice: {
    fontSize: '$s',
  },
});
