import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { styles } from '../css/EventFilterBarStyles';

interface FilterOption {
  label: string;
  icon: keyof typeof FontAwesome.glyphMap;
  color: string;
  filterKey: string;
}

const filters: FilterOption[] = [
  { label: 'Hoy', icon: 'calendar', color: '#3498db', filterKey: 'today' },
  { label: 'Mañana', icon: 'calendar', color: '#3498db', filterKey: 'tomorrow' },
  { label: 'Este fin de semana', icon: 'calendar', color: '#3498db', filterKey: 'weekend' },
  { label: 'Ver todo', icon: 'calendar', color: '#3498db', filterKey: 'all' }
];

interface Props {
  onFilterSelect: (filterKey: string) => void;
}

const EventFilterBar: React.FC<Props> = ({ onFilterSelect }) => {
  const renderItem = ({ item }: { item: FilterOption }) => (
    <TouchableOpacity 
      key={item.filterKey} 
      style={[styles.filterButton, { borderColor: item.color }]} 
      onPress={() => onFilterSelect(item.filterKey)}
    >
      <FontAwesome name={item.icon} size={18} color={item.color} />
      <Text style={styles.filterText}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filters}
        keyExtractor={(item) => item.filterKey}
        numColumns={2}
        renderItem={renderItem}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
};

export default EventFilterBar;
