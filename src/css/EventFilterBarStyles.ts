import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#white',
  },
  row: {
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#white',
    borderRadius: 10,
    padding: 10,
    margin: 5,
    borderWidth: 1,
  },
  filterText: {
    color: '#black',
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
  },
  favoriteIconActive: {
    color: '#FFD700',
  },
  favoriteIconInactive: {
    color: '#7f8c8d',
  },
});
