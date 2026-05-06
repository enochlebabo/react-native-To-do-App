import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import Checkbox from 'expo-checkbox';
import { Todo } from '../types/todo';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

interface TodoCardProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (title: string, description: string, priority: Todo['priority'], dueDate?: Date) => void;
  onAddSubtask: (title: string) => void;
  onToggleSubtask: (subtaskId: string) => void;
  onDeleteSubtask: (subtaskId: string) => void;
}

export default function TodoCard({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: TodoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [newSubtask, setNewSubtask] = useState('');
  const [showAddSubtask, setShowAddSubtask] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa44';
      case 'low': return '#44ff44';
      default: return '#888888';
    }
  };

  const handleSaveEdit = () => {
    onEdit(editTitle, editDescription, editPriority);
    setIsEditing(false);
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAddSubtask(newSubtask);
      setNewSubtask('');
      setShowAddSubtask(false);
    }
  };

  return (
    <>
      <ThemedView style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Checkbox
              value={todo.completed}
              onValueChange={onToggle}
              style={styles.checkbox}
            />
            <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.titlePress}>
              <ThemedText 
                type="defaultSemiBold" 
                style={[
                  styles.title, 
                  todo.completed && styles.completedText
                ]}
              >
                {todo.title}
              </ThemedText>
            </TouchableOpacity>
          </View>
          <View style={styles.badgeContainer}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(todo.priority) }]}>
              <Text style={styles.priorityText}>{todo.priority}</Text>
            </View>
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {todo.description ? (
          <ThemedText style={styles.description}>{todo.description}</ThemedText>
        ) : null}
        
        {todo.dueDate && (
          <ThemedText style={styles.dueDate}>
            Due: {new Date(todo.dueDate).toLocaleDateString()}
          </ThemedText>
        )}

        {/* Subtasks Section */}
        {todo.subtasks.length > 0 && (
          <View style={styles.subtasksSection}>
            <ThemedText type="defaultSemiBold" style={styles.subtasksTitle}>Subtasks:</ThemedText>
            {todo.subtasks.map((subtask) => (
              <View key={subtask.id} style={styles.subtaskItem}>
                <Checkbox
                  value={subtask.completed}
                  onValueChange={() => onToggleSubtask(subtask.id)}
                  style={styles.subtaskCheckbox}
                />
                <ThemedText style={[subtask.completed && styles.completedText]}>
                  {subtask.title}
                </ThemedText>
                <TouchableOpacity onPress={() => onDeleteSubtask(subtask.id)}>
                  <Text style={styles.deleteSubtask}>❌</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity 
          onPress={() => setShowAddSubtask(true)} 
          style={styles.addSubtaskButton}
        >
          <Text style={styles.addSubtaskText}>+ Add Subtask</Text>
        </TouchableOpacity>
      </ThemedView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditing}
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>Edit Todo</ThemedText>
            
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={editTitle}
              onChangeText={setEditTitle}
              placeholderTextColor="#999"
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Description"
              value={editDescription}
              onChangeText={setEditDescription}
              multiline
              placeholderTextColor="#999"
            />
            
            <Text style={styles.label}>Priority:</Text>
            <View style={styles.priorityButtons}>
              {(['low', 'medium', 'high'] as const).map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    editPriority === priority && styles.priorityButtonActive,
                    { backgroundColor: getPriorityColor(priority) + '30' }
                  ]}
                  onPress={() => setEditPriority(priority)}
                >
                  <Text style={styles.priorityButtonText}>{priority}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveEdit} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>

      {/* Add Subtask Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAddSubtask}
        onRequestClose={() => setShowAddSubtask(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>Add Subtask</ThemedText>
            
            <TextInput
              style={styles.input}
              placeholder="Subtask title"
              value={newSubtask}
              onChangeText={setNewSubtask}
              placeholderTextColor="#999"
              autoFocus
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setShowAddSubtask(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddSubtask} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    marginRight: 12,
  },
  titlePress: {
    flex: 1,
  },
  title: {
    fontSize: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 18,
  },
  description: {
    marginLeft: 28,
    marginBottom: 8,
    fontSize: 14,
  },
  dueDate: {
    marginLeft: 28,
    fontSize: 12,
    opacity: 0.7,
  },
  subtasksSection: {
    marginLeft: 28,
    marginTop: 12,
    marginBottom: 8,
  },
  subtasksTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  subtaskCheckbox: {
    marginRight: 8,
  },
  deleteSubtask: {
    fontSize: 12,
    marginLeft: 'auto',
  },
  addSubtaskButton: {
    marginLeft: 28,
    marginTop: 8,
  },
  addSubtaskText: {
    color: '#007AFF',
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
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
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
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