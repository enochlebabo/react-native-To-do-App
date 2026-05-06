import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Todo } from '../types/todo';

interface AddTodoModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (todo: Omit<Todo, 'id' | 'createdAt' | 'subtasks'>) => void;
}

export default function AddTodoModal({ visible, onClose, onAdd }: AddTodoModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Todo['priority']>('medium');
  const [category, setCategory] = useState('Personal');
  const [hasDueDate, setHasDueDate] = useState(false);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const categories = ['Personal', 'Work', 'Shopping', 'Health', 'Other'];

  const handleSubmit = () => {
    if (title.trim()) {
      onAdd({
        title: title.trim(),
        description: description.trim(),
        completed: false,
        priority,
        category,
        dueDate: hasDueDate ? dueDate : undefined,
      });
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('Personal');
    setHasDueDate(false);
    setDueDate(new Date());
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
      setHasDueDate(true);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <ThemedText type="title" style={styles.modalTitle}>Add New Todo</ThemedText>
            
            <TextInput
              style={styles.input}
              placeholder="Title *"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
              multiline
              placeholderTextColor="#999"
            />
            
            <ThemedText style={styles.label}>Priority:</ThemedText>
            <View style={styles.priorityButtons}>
              {(['low', 'medium', 'high'] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityButton,
                    priority === p && styles.priorityButtonActive,
                    { backgroundColor: p === 'high' ? '#ff444430' : p === 'medium' ? '#ffaa4430' : '#44ff4430' }
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <ThemedText style={styles.priorityButtonText}>{p}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            
            <ThemedText style={styles.label}>Category:</ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryButton,
                    category === cat && styles.categoryButtonActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <ThemedText style={styles.categoryText}>{cat}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <ThemedText style={styles.dateButtonText}>
                {hasDueDate ? `Due: ${dueDate.toLocaleDateString()}` : 'Set Due Date (Optional)'}
              </ThemedText>
            </TouchableOpacity>
            
            {hasDueDate && (
              <TouchableOpacity 
                style={styles.clearDateButton}
                onPress={() => setHasDueDate(false)}
              >
                <ThemedText style={styles.clearDateText}>Clear Due Date</ThemedText>
              </TouchableOpacity>
            )}
            
            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
                <ThemedText style={styles.saveButtonText}>Add Todo</ThemedText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  priorityButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  priorityButtonText: {
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  categoriesScroll: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  categoryButtonActive: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontSize: 14,
  },
  dateButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateButtonText: {
    fontSize: 14,
  },
  clearDateButton: {
    padding: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  clearDateText: {
    color: '#ff4444',
    fontSize: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ff4444',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});