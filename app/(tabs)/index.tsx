import React, { useState } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTodos } from '../../src/context/TodoContext';
import TodoCard from '../../src/components/TodoCard';
import AddTodoModal from '../../src/components/AddTodoModal';
import { TodoFilter, PriorityFilter } from '../../src/types/todo';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  const { 
    todos, 
    addTodo, 
    updateTodo, 
    deleteTodo, 
    toggleComplete,
    addSubtask,
    toggleSubtask,
    deleteSubtask
  } = useTodos();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

  const getFilteredTodos = () => {
    let filtered = todos;
    
    // Apply completion filter
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(todo => todo.priority === priorityFilter);
    }
    
    return filtered;
  };

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    active: todos.filter(t => !t.completed).length,
    highPriority: todos.filter(t => t.priority === 'high' && !t.completed).length,
  };

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <ThemedText type="title">Tasks To Be Done</ThemedText>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <IconSymbol name="plus.circle.fill" size={44} color="#007AFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#44ff44' }]}>{stats.active}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#ff4444' }]}>{stats.completed}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#ffaa44' }]}>{stats.highPriority}</Text>
          <Text style={styles.statLabel}>High Priority</Text>
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Status:</Text>
        <View style={styles.filterButtons}>
          {(['all', 'active', 'completed'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterButton, filter === f && styles.filterButtonActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Priority:</Text>
        <View style={styles.filterButtons}>
          {(['all', 'low', 'medium', 'high'] as const).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.filterButton, priorityFilter === p && styles.filterButtonActive]}
              onPress={() => setPriorityFilter(p)}
            >
              <Text style={[styles.filterText, priorityFilter === p && styles.filterTextActive]}>
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  const filteredTodos = getFilteredTodos();

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.container}>
        <FlatList
          data={filteredTodos}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TodoCard
              todo={item}
              onToggle={() => toggleComplete(item.id)}
              onDelete={() => deleteTodo(item.id)}
              onEdit={(title, description, priority, dueDate) => 
                updateTodo(item.id, { title, description, priority, dueDate })
              }
              onAddSubtask={(title) => addSubtask(item.id, title)}
              onToggleSubtask={(subtaskId) => toggleSubtask(item.id, subtaskId)}
              onDeleteSubtask={(subtaskId) => deleteSubtask(item.id, subtaskId)}
            />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="checkmark.circle" size={64} color="#ccc" />
              <ThemedText style={styles.emptyText}>No todos yet!</ThemedText>
              <ThemedText style={styles.emptySubtext}>Tap the + button to add your first task</ThemedText>
            </View>
          }
          contentContainerStyle={styles.listContent}
        />
        
        <AddTodoModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={addTodo}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    padding: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
    color: '#666',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: 'white',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});