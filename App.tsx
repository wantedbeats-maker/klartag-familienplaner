import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const familyMembers = [
  { id: 'm1', name: 'Mara', role: 'Mama' },
  { id: 'm2', name: 'Paul', role: 'Papa' },
  { id: 'm3', name: 'Leo', role: 'Kind' },
  { id: 'm4', name: 'Anna', role: 'Oma' },
];

const tasks = [
  { id: 't1', title: 'Turnbeutel packen', assignee: 'Mara', due: 'Heute', status: 'offen' },
  { id: 't2', title: 'Küchen aufräumen', assignee: 'Paul', due: 'Morgen', status: 'offen' },
  { id: 't3', title: 'Schulranzen vorbereiten', assignee: 'Leo', due: 'Heute', status: 'offen' },
];

const events = [
  { id: 'e1', title: 'Arzttermin', time: '15:30', category: 'Gesundheit', assignee: 'Paul' },
  { id: 'e2', title: 'Elternabend', time: '19:00', category: 'Schule', assignee: 'Mara' },
];

const shopping = [
  { id: 's1', name: 'Milch', done: false },
  { id: 's2', name: 'Bananen', done: true },
  { id: 's3', name: 'Toilettenpapier', done: false },
];

const tabs = ['Heute', 'Aufgaben', 'Termine', 'Familie'] as const;
type Tab = (typeof tabs)[number];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('Heute');

  const todayStats = useMemo(
    () => ({
      tasks: tasks.filter((task) => task.due === 'Heute').length,
      events: events.length,
      shopping: shopping.filter((item) => !item.done).length,
    }),
    []
  );

  const renderToday = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Heute</Text>
      <Text style={styles.date}>06.11.2026</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>
          {todayStats.events} Termine · {todayStats.tasks} Aufgaben · {todayStats.shopping} Einkaufspunkte
        </Text>
      </View>

      <Section title="Termine heute">
        {events.map((event) => (
          <Card key={event.id}>
            <Text style={styles.cardTitle}>{event.title}</Text>
            <Text style={styles.cardMeta}>{event.time} · {event.category}</Text>
            <Text style={styles.cardMeta}>Verantwortlich: {event.assignee}</Text>
          </Card>
        ))}
      </Section>

      <Section title="Aufgaben offen">
        {tasks.map((task) => (
          <Card key={task.id}>
            <Text style={styles.cardTitle}>{task.title}</Text>
            <Text style={styles.cardMeta}>Fällig: {task.due}</Text>
            <Text style={styles.cardMeta}>Verantwortlich: {task.assignee}</Text>
          </Card>
        ))}
      </Section>

      <Section title="Einkaufsliste">
        {shopping.map((item) => (
          <View key={item.id} style={styles.shoppingRow}>
            <Text style={item.done ? styles.doneText : styles.normalText}>{item.name}</Text>
            <Text style={styles.smallLabel}>{item.done ? 'erledigt' : 'offen'}</Text>
          </View>
        ))}
      </Section>
    </ScrollView>
  );

  const renderTasks = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Aufgaben</Text>
      {tasks.map((task) => (
        <Card key={task.id}>
          <Text style={styles.cardTitle}>{task.title}</Text>
          <Text style={styles.cardMeta}>Verantwortlich: {task.assignee}</Text>
          <Text style={styles.cardMeta}>Fällig: {task.due}</Text>
          <Text style={styles.cardMeta}>Status: {task.status}</Text>
        </Card>
      ))}
    </ScrollView>
  );

  const renderEvents = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Termine</Text>
      {events.map((event) => (
        <Card key={event.id}>
          <Text style={styles.cardTitle}>{event.title}</Text>
          <Text style={styles.cardMeta}>{event.time}</Text>
          <Text style={styles.cardMeta}>{event.category}</Text>
          <Text style={styles.cardMeta}>Wer: {event.assignee}</Text>
        </Card>
      ))}
    </ScrollView>
  );

  const renderFamily = () => (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.title}>Familie</Text>
      {familyMembers.map((member) => (
        <Card key={member.id}>
          <Text style={styles.cardTitle}>{member.name}</Text>
          <Text style={styles.cardMeta}>{member.role}</Text>
        </Card>
      ))}
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Aufgaben':
        return renderTasks();
      case 'Termine':
        return renderEvents();
      case 'Familie':
        return renderFamily();
      case 'Heute':
      default:
        return renderToday();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {renderTabContent()}

        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.tabButton, isActive && styles.tabButtonActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.sectionBlock}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  content: {
    padding: 20,
    paddingBottom: 110,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 6,
  },
  date: {
    fontSize: 18,
    color: '#94a3b8',
    marginBottom: 18,
  },
  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#334155',
  },
  summaryText: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionBlock: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  cardMeta: {
    fontSize: 14,
    color: '#cbd5e1',
    marginTop: 2,
  },
  shoppingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  normalText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '500',
  },
  doneText: {
    color: '#94a3b8',
    fontSize: 16,
    textDecorationLine: 'line-through',
  },
  smallLabel: {
    color: '#67e8f9',
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    backgroundColor: '#111827',
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#1d4ed8',
  },
  tabText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#f8fafc',
  },
});