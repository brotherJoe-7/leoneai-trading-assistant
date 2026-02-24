import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const LearnScreen = () => {
  const courses = [
    { id: 1, title: 'Introduction to Trading', duration: '30 min', level: 'Beginner', icon: '📚' },
    { id: 2, title: 'Cryptocurrency Basics', duration: '45 min', level: 'Beginner', icon: '₿' },
    { id: 3, title: 'Technical Analysis', duration: '60 min', level: 'Intermediate', icon: '📊' },
    { id: 4, title: 'Trading in Sierra Leone', duration: '25 min', level: 'Beginner', icon: '🇸🇱' },
    { id: 5, title: 'Mobile Money Trading', duration: '20 min', level: 'Beginner', icon: '📱' }
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Learning Center</Text>
        <Text style={styles.subtitle}>Master trading with our courses</Text>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Your Progress</Text>
        <View style={styles.progressStats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>40%</Text>
            <Text style={styles.statLabel}>Overall</Text>
          </View>
        </View>
      </View>

      <View style={styles.coursesSection}>
        <Text style={styles.sectionTitle}>Available Courses</Text>
        {courses.map((course) => (
          <TouchableOpacity key={course.id} style={styles.courseCard}>
            <Text style={styles.courseIcon}>{course.icon}</Text>
            <View style={styles.courseInfo}>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <View style={styles.courseMeta}>
                <Text style={styles.courseDuration}>⏱ {course.duration}</Text>
                <Text style={[styles.courseLevel, styles[course.level.toLowerCase()]]}>
                  {course.level}
                </Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#667eea', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 14, color: '#fff', opacity: 0.9, marginTop: 4 },
  progressCard: { backgroundColor: '#fff', margin: 16, padding: 20, borderRadius: 12 },
  progressTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  progressStats: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#667eea' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  coursesSection: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  courseCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  courseIcon: { fontSize: 32, marginRight: 16 },
  courseInfo: { flex: 1 },
  courseTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  courseMeta: { flexDirection: 'row', gap: 12 },
  courseDuration: { fontSize: 12, color: '#666' },
  courseLevel: { fontSize: 12, fontWeight: '600', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  beginner: { backgroundColor: '#dbeafe', color: '#1e40af' },
  intermediate: { backgroundColor: '#fef3c7', color: '#92400e' },
  arrow: { fontSize: 24, color: '#667eea' }
});

export default LearnScreen;
