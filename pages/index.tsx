import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator, Alert, Keyboard, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const alturaStatusBar = StatusBar.currentHeight;
const KEY_GPT = 'your key';

export function Home() {
  const [load, defLoad] = useState(false);
  const [receita, defReceita] = useState("");
  const [ingr1, defIngr1] = useState("");
  const [ingr2, defIngr2] = useState("");
  const [ingr3, defIngr3] = useState("");
  const [ingr4, defIngr4] = useState("");
  const [ocasiao, defOcasiao] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  async function gerarReceita() {
    if (ingr1 === "" || ingr2 === "" || ingr3 === "" || ingr4 === "" || ocasiao === "") {
      Alert.alert("Atenção", "Informe todos os ingredientes!", [{ text: "Beleza!" }]);
      return;
    }
    defReceita("");
    defLoad(true);
    Keyboard.dismiss();

    const prompt = `Sugira uma receita detalhada para o ${ocasiao} usando os ingredientes: ${ingr1}, ${ingr2}, ${ingr3} e ${ingr4} e pesquise a receita no YouTube. Caso encontre, informe o link.`;

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY_GPT}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 500,
        top_p: 1,
      })
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data.choices[0].message.content);
        defReceita(data.choices[0].message.content);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        defLoad(false);
      });
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent={true} backgroundColor="#f1f1f1" />
      <Text style={styles.header}>Cozinha Fácil</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Insira os Ingredientes</Text>
        <TextInput
          placeholder="Ingrediente 1"
          style={styles.input}
          value={ingr1}
          onChangeText={defIngr1}
        />
        <TextInput
          placeholder="Ingrediente 2"
          style={styles.input}
          value={ingr2}
          onChangeText={defIngr2}
        />
        <TextInput
          placeholder="Ingrediente 3"
          style={styles.input}
          value={ingr3}
          onChangeText={defIngr3}
        />
        <TextInput
          placeholder="Ingrediente 4"
          style={styles.input}
          value={ingr4}
          onChangeText={defIngr4}
        />
        <TextInput
          placeholder="Almoço ou Jantar"
          style={styles.input}
          value={ocasiao}
          onChangeText={defOcasiao}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={gerarReceita}>
        <Text style={styles.buttonText}>Gerar Receita</Text>
        <MaterialIcons name="travel-explore" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {load && (
          <View style={styles.content}>
            <Text style={styles.title}>Produzindo receita...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {receita && (
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Sua receita 👇</Text>
            <Text style={styles.receitaText}>{receita}</Text>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    paddingTop: 20,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? alturaStatusBar : 54,
    color: '#000',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 12,
    color: '#000',
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: '#fff',
    color: '#000'
  },
  button: {
    backgroundColor: '#000',
    width: '90%',
    borderRadius: 50,
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    marginRight: 8
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    width: '100%',
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
    color: '#000'
  },
  scrollContainer: {
    paddingBottom: 24,
    marginTop: 20,
    width: '90%',
  },
  receitaText: {
    lineHeight: 28,
    color: '#000',
    fontSize: 16
  }
});