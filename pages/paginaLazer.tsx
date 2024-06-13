import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Platform, StatusBar, ScrollView, ActivityIndicator, Alert, Keyboard, Animated, Easing } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const alturaStatusBar = StatusBar.currentHeight;
const KEY_GPT = 'your key'; // Substitua 'your key' pela sua chave da API OpenAI

export function Lazer() {
  const [load, defLoad] = useState(false);
  const [atividadeFavorita, setAtividadeFavorita] = useState("");
  const [local, setLocal] = useState("");
  const [clima, setClima] = useState("");
  const [recomendacao, setRecomendacao] = useState("");
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [recomendacao]);

  async function obterRecomendacao() {
    defLoad(true);
    Keyboard.dismiss();

    const prompt = `Sugira uma atividade de lazer para mim, considerando que minha atividade favorita é ${atividadeFavorita}, meu local preferido é ${local} e o clima é ${clima}.`;

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
        setRecomendacao(data.choices[0].message.content);
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
      <Text style={styles.header}>Recomendação de Lazer</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Informe suas preferências:</Text>
        <TextInput
          placeholder="Atividade favorita (ex: cinema, caminhada, leitura)"
          style={styles.input}
          value={atividadeFavorita}
          onChangeText={text => setAtividadeFavorita(text)}
        />
        <TextInput
          placeholder="Local (ex: parque, museu, centro comercial)"
          style={styles.input}
          value={local}
          onChangeText={text => setLocal(text)}
        />
        <TextInput
          placeholder="Clima (ex: ensolarado, chuvoso)"
          style={styles.input}
          value={clima}
          onChangeText={text => setClima(text)}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={obterRecomendacao}>
        <Text style={styles.buttonText}>Obter Recomendação</Text>
        <MaterialIcons name="search" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView style={styles.containerScroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24, marginTop: 4 }}>
        {load && (
          <View style={styles.content}>
            <Text style={styles.title}>Analisando suas preferências...</Text>
            <ActivityIndicator color="#000" size="large" />
          </View>
        )}

        {recomendacao && (
          <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
            <Text style={styles.title}>Sua recomendação de lazer:</Text>
            <Text style={styles.recomendacaoText}>{recomendacao}</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    paddingTop: Platform.OS === 'android' ? alturaStatusBar : 54,
    color: '#000',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#FFF',
    width: '90%',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ccc',
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  button: {
    backgroundColor: '#000',
    width: '90%',
    borderRadius: 8,
    flexDirection: 'row',
    padding: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  content: {
    backgroundColor: '#fff',
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
    color: '#000',
  },
  containerScroll: {
    width: '90%',
    marginTop: 8,
  },
  recomendacaoText: {
    lineHeight: 24,
    color: '#000',
    fontSize: 16,
  },
});