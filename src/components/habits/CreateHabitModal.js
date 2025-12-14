// src/components/habits/CreateHabitModal.js
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Sizes } from '@/src/constants';

const EMOJI_OPTIONS = ['🧘', '💧', '💪', '📚', '🏃', '🎯', '🌱', '✨', '🎨', '🎵', '🍎', '😴'];

export const CreateHabitModal = ({ visible, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('✨');

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        icon: selectedEmoji,
        type: 'binary',
      });
      // Сбросить форму
      setName('');
      setSelectedEmoji('✨');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={styles.modal}>
          <Text style={styles.title}>Новая привычка</Text>

          <Text style={styles.label}>Название</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Например: Утренняя пробежка"
            placeholderTextColor={Colors.textDisabled}
            autoFocus
          />

          <Text style={styles.label}>Выберите иконку</Text>
          <View style={styles.emojiGrid}>
            {EMOJI_OPTIONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.emojiButton,
                  selectedEmoji === emoji && styles.emojiButtonSelected,
                ]}
                onPress={() => setSelectedEmoji(emoji)}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onClose}
            >
              <Text style={styles.buttonTextCancel}>Отмена</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonSubmit]}
              onPress={handleSubmit}
              disabled={!name.trim()}
            >
              <Text style={styles.buttonTextSubmit}>Создать</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Sizes.borderRadius.xl,
    borderTopRightRadius: Sizes.borderRadius.xl,
    padding: Sizes.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : Sizes.spacing.lg,
  },
  title: {
    fontSize: Sizes.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.spacing.lg,
  },
  label: {
    fontSize: Sizes.fontSize.md,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.spacing.sm,
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: Sizes.borderRadius.md,
    padding: Sizes.spacing.md,
    fontSize: Sizes.fontSize.lg,
    color: Colors.text,
    marginBottom: Sizes.spacing.lg,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.spacing.sm,
    marginBottom: Sizes.spacing.xl,
  },
  emojiButton: {
    width: 56,
    height: 56,
    borderRadius: Sizes.borderRadius.md,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
  },
  emoji: {
    fontSize: 28,
  },
  buttons: {
    flexDirection: 'row',
    gap: Sizes.spacing.md,
  },
  button: {
    flex: 1,
    padding: Sizes.spacing.md,
    borderRadius: Sizes.borderRadius.md,
    alignItems: 'center',
  },
  buttonCancel: {
    backgroundColor: Colors.background,
  },
  buttonSubmit: {
    backgroundColor: Colors.primary,
  },
  buttonTextCancel: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.text,
  },
  buttonTextSubmit: {
    fontSize: Sizes.fontSize.lg,
    fontWeight: '600',
    color: Colors.surface,
  },
});
