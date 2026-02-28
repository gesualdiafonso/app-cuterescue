// Pagina de Eventos
import React, { useEffect, useState } from "react"
import { 
    View, Text, 
    StyleSheet, ScrollView, 
    ActivityIndicator, TouchableOpacity, 
    Linking 
} from "react-native"

import { getEvents } from "../../../src/services/events.services"

export default function Events(){

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load(){
            try {
                const data = await getEvents();
                setEvents(data);
            } catch (err) {
                console.error("Error al cargar eventos:", err);
                setError("No se pudieron cargar los eventos. Intenta de nuevo más tarde.");
            } finally{
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading){
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#f7a82a" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    return(
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Eventos en Buenos Aires, Capital</Text>

            {events.length === 0 ? (
                <Text style={styles.emptyText}> No hay eventos disponibles actualmente.</Text>
            ) : (
                events.map((event) => (
                    <View key={event.id} style={styles.card}>
                        <Text style={styles.cardTitle}>{event.title}</Text>

                        {event.summary && (
                            <Text style={styles.cardSummary}>{event.summary}</Text>
                        )}

                        {event.locations?.length > 0 && (
                            <View style={styles.locationContainer}>
                                <Text style={styles.locationHeader}>Ubiaciones:</Text>
                                {event.locations.map((loc, i) => (
                                    <Text key={i} style={styles.locationItem}>
                                        • <Text style={{ fontWeight: '700' }}>{loc.name}</Text> - {loc.address}
                                    </Text>
                                ))}
                            </View>
                        )}

                        {event.source_url && (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => Linking.openURL(event.source_url)}
                            >
                                <Text style={styles.buttonText}>Ver más</Text>
                            </TouchableOpacity>
                        )}

                    </View>
                ))
            )}

        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22687B',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#22687B',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Sombra no Android
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  cardSummary: {
    fontSize: 14,
    color: '#d5d5d5',
    textAlign: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    marginTop: 8,
  },
  locationHeader: {
    color: '#f7a934',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationItem: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#f7a82a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});