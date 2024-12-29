import * as React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { DataTable } from 'react-native-paper';
import axios from 'axios';

const EventsTableScreen = () => {
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([5, 10, 15]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://raw-backend47.vercel.app/api/v2/getEvents');
      setEvents(response.data.events);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, events.length);

  return (
    <DataTable style={styles.container}>
      <DataTable.Header>
        <DataTable.Title>Title</DataTable.Title>
        <DataTable.Title>Date</DataTable.Title>
        <DataTable.Title>Location</DataTable.Title>
        <DataTable.Title>Category</DataTable.Title>
      </DataTable.Header>

      {events.slice(from, to).map((event) => (
        <DataTable.Row key={event._id}>
          <DataTable.Cell>{event.title}</DataTable.Cell>
          <DataTable.Cell>{formatDate(event.date)}</DataTable.Cell>
          <DataTable.Cell>{event.location}</DataTable.Cell>
          <DataTable.Cell>{event.category}</DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(events.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${events.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
    </DataTable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EventsTableScreen;