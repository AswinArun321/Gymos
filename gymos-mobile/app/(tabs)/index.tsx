import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      // REPLACE THIS IP WITH YOUR COMPUTER'S IPv4 ADDRESS!
      // Example: 'http://192.168.1.5:5000/api/auth/login'
      const response = await fetch('http://192.168.1.36:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // This creates a native mobile pop-up!
        Alert.alert("Login Successful! 🚀", `Welcome back, ${data.user.name}`);
      } else {
        Alert.alert("Login Failed ❌", data.error || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Make sure your backend is running and the IP address is correct.");
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GymOS Mobile</Text>
      <Text style={styles.subtitle}>Sign in to your workspace</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

// React Native uses 'StyleSheets' instead of CSS/Tailwind (for now)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1e3a8a', // blue-900
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b', // slate-500
    marginBottom: 40,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#2563eb', // blue-600
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});