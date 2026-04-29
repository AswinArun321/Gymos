import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // NEW: State to hold the logged-in user's data
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://192.168.1.36:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Boom! Save the user data to state, which triggers the UI change
        setUser(data.user); 
      } else {
        Alert.alert("Login Failed ❌", data.error || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Make sure your backend is running and the IP address is correct.");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
  };

  // ==========================================
  // VIEW 1: THE MEMBER DASHBOARD
  // ==========================================
  if (user) {
    return (
      <View style={styles.dashboardContainer}>
        <Text style={styles.dashboardTitle}>GymOS</Text>
        
        {/* Digital Membership Card */}
        <View style={styles.card}>
            <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <Text style={styles.memberName}>{user.name}</Text>
            <Text style={styles.memberStatus}>Active Member</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.cardDetail}>Plan: <Text style={styles.boldText}>Pro Monthly</Text></Text>
            <Text style={styles.cardDetail}>Member ID: <Text style={styles.boldText}>#{user.user_id}</Text></Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ==========================================
  // VIEW 2: THE LOGIN SCREEN
  // ==========================================
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
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!isLoading}
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? "Connecting..." : "Sign In"}</Text>
      </TouchableOpacity>
    </View>
  );
}

// React Native uses 'StyleSheets' instead of CSS/Tailwind
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
  
  // New Styles for the Dashboard
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#1e3a8a', // Dark blue background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  dashboardTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#60a5fa', // blue-400
    marginBottom: 30,
    letterSpacing: 2,
  },
  card: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    backgroundColor: '#dbeafe', // blue-100
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e40af', // blue-800
  },
  memberName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a', // slate-900
  },
  memberStatus: {
    fontSize: 14,
    color: '#10b981', // emerald-500
    fontWeight: 'bold',
    marginTop: 5,
    textTransform: 'uppercase',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 20,
  },
  cardDetail: {
    fontSize: 16,
    color: '#475569',
    width: '100%',
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#0f172a',
  },
  logoutButton: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});