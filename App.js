import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const jsonTasks = await AsyncStorage.getItem('tasks');
      if (jsonTasks !== null) {
        const parsedTasks = JSON.parse(jsonTasks);
        setTasks(parsedTasks);
      }
    } catch (error) {
      console.error('Error loading Tasks', error);
    }
  };

  const saveTasks = async (tasks) => {
    try {
      const jsonTasks = JSON.stringify(tasks);
      await AsyncStorage.setItem('tasks', jsonTasks);
    } catch (error) {
      console.error('Error saving New Task:', error);
    }
  };

  const handleAddTask = () => {
    if (task) {
      const newTask = {text:task, completed: false};
      setTasks([...tasks, newTask]);
      setTask('');
      saveTasks([...tasks, newTask]);
    }
  };

  const handleToggleTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleRemoveTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.task, item.completed ? styles.completed : null]}>
      <Text style={styles.taskText}>{item.text}</Text>
      <TouchableOpacity onPress={() => handleToggleTask(index)}>
        <Text style={styles.checkmark}>{item.completed ? '✔' : '■'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleRemoveTask(index)}>
        <Text style={styles.remove}>✖</Text>
      </TouchableOpacity>
    </View>
  );


  return (
    <View style={styles.container}>
      <Text style={styles.title}>ToDo List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.list}
        data={tasks}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'goldenrod',
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: 'goldenrod',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  list: {
    width: '90%',
  },
  task: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: 'goldenrod',
    borderBottomWidth: 2,
    padding: 10,
    width: '90%',
  },
  taskText: {
    flex: 1,
    fontSize: 18,
  },
  completed: {
    textDecorationLine: 'line-through',
    opacity: 0.4,
    textDecorationStyle: 'solid',
  },
  checkmark: {
    fontSize: 18,
    marginRight: 10,
    color: 'green',
  },
  remove: {
    fontSize: 18,
    color: 'crimson',
  },
});

export default App;