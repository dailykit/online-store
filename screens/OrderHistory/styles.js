import EStyleSheet from 'react-native-extended-stylesheet';

export const styles = EStyleSheet.create({
  heading: {
    fontSize: '$l',
    fontWeight: 500,
    color: '#666',
    paddingVertical: 12,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    padding: 15,
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
    fontSize: '$l',
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
    fontSize: '$l',
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
    fontSize: '$xs',
    flex: 1,
  },
  productOption: {
    fontSize: '$xxs',
    color: '#666',
  },
  productPrice: {
    fontSize: '$s',
  },
});
