import React, { useState, useRef, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, Animated, Modal, TextInput, ScrollView, Image } from 'react-native'
import { theme } from '../utils/theme'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { typography } from '../utils/typography';
import { Table, Row, Rows } from 'react-native-table-component';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');
const ITEMS_PER_PAGE = 10;

const PatientDocumentScreen = ({ patient, setPatientDocuments, activeTab, navigation }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDocumentModalVisible, setIsDocumentModalVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Documents');
  const sidebarAnimation = useRef(new Animated.Value(0)).current;

  const toggleSidebar = () => {
    const toValue = isSidebarVisible ? 0 : 1;
    Animated.timing(sidebarAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsSidebarVisible(!isSidebarVisible);
  };

  // Function to handle document viewing
  const handleViewDocument = (document) => {
    setSelectedDocument(document);
    setIsDocumentModalVisible(true);
  };

  // Function to prevent screenshots
  useEffect(() => {
    if (isDocumentModalVisible) {

      console.log('Screenshot prevention enabled');
    }
  }, [isDocumentModalVisible]);

  const categories = [
    'All Documents',
    'Radiology',
    'Lab Results',
    'Prescriptions',
    'Medical Reports',
    'Other'
  ];

  const tableHead = ['File Name', 'Category', 'Date', 'Action'];
  const allTableData = [
    [
      <View style={styles.row}>
        <MaterialCommunityIcons name="image" size={24} color={theme.colors.primary} />
        <Text style={styles.cell}>Chest X-ray</Text>
      </View>,
      'Radiology',
      'Mar 12, 2023',
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => handleViewDocument({ type: 'image', url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpG0xwjiIHyvGSCIJDOCZ_VEzEntS0LHnhCQ&s' })}>
          <MaterialCommunityIcons name="eye" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    ],
    [
      <View style={styles.row}>
        <MaterialCommunityIcons name="file" size={24} color={theme.colors.primary} />
        <Text style={styles.cell}>Blood work result</Text>
      </View>,
      'Lab Results',
      'Mar 12, 2023',
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => handleViewDocument({ type: 'pdf', url: 'https://orange-angelita-44.tiiny.site' })}>
        <MaterialCommunityIcons name="eye" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
    ],]

  // Filter table data based on selected category
  const filteredTableData = selectedCategory === 'All Documents' 
    ? allTableData 
    : allTableData.filter(item => item[1] === selectedCategory);

  // Calculate pagination with filtered data
  const totalPages = Math.ceil(filteredTableData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTableData = filteredTableData.slice(startIndex, endIndex);

  // Reset to first page when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setPatientDocuments(null)}>
          <MaterialCommunityIcons name="chevron-left" size={30} color={theme.colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{activeTab === 'Out - Patients' ?patient.PATIENT_NAME:patient.PatientName} {'\n'} Files & Documents</Text>
          <Text style={styles.uhidText}>{activeTab === 'Out - Patients' ?patient.UHID:patient.Uhid} | {activeTab === 'Out - Patients' ?patient.AGE:patient.Age} Years | {activeTab === 'Out - Patients' ?patient.Sex:patient.Gender}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={toggleSidebar}>
            <MaterialCommunityIcons name="filter" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {filteredTableData.length > 0 ? (
          <Table borderStyle={{ backgroundColor:'#fff' }}>
            <Row data={tableHead} style={styles.head} textStyle={styles.text} />
            <Rows data={currentTableData} textStyle={styles.text} />
          </Table>
        ) : (
          <View style={styles.noDocumentsContainer}>
            <MaterialCommunityIcons name="file-document-outline" size={64} color={theme.colors.primary} />
            <Text style={styles.noDocumentsText}>No documents found</Text>
            <Text style={styles.noDocumentsSubText}>
              {selectedCategory === 'All Documents' 
                ? 'There are no documents available for this patient.'
                : `No ${selectedCategory.toLowerCase()} documents available.`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Only show pagination if there are documents */}
      {filteredTableData.length > 0 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
            onPress={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <MaterialCommunityIcons name="chevron-left" size={24} color={currentPage === 1 ? '#ccc' : theme.colors.primary} />
          </TouchableOpacity>
          
          <Text style={styles.paginationText}>
            Page {currentPage} of {totalPages}
          </Text>
          
          <TouchableOpacity 
            style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
            onPress={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <MaterialCommunityIcons name="chevron-right" size={24} color={currentPage === totalPages ? '#ccc' : theme.colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Sidebar */}
      {isSidebarVisible && (
        <Animated.View 
          style={[
            styles.sidebar,
            {
              transform: [{
                translateX: sidebarAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [width, 0]
                })
              }]
            }
          ]}
        >
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Filter by Category</Text>
            <TouchableOpacity onPress={toggleSidebar}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesList}>
            {categories.map((category, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.categoryItem,
                  selectedCategory === category && styles.selectedCategoryItem
                ]}
                onPress={() => {
                  setSelectedCategory(category);
                  toggleSidebar();
                }}
              >
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText
                ]}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}

      {isDocumentModalVisible&& 
      <Modal
        visible={isDocumentModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDocumentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.documentModalContent}>
            <View style={styles.documentModalHeader}>
              <Text style={styles.documentModalTitle}>Document View</Text>
              <TouchableOpacity onPress={() => setIsDocumentModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            <View style={styles.documentViewer}>
              {selectedDocument?.type === 'image' ? (
                <Image
                  source={{ uri: selectedDocument.url }}
                  style={styles.documentImage}
                  resizeMode="contain"
                />
              ) : (
                <WebView
                  source={{ uri: selectedDocument?.url }}
                  style={styles.documentWebView}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  startInLoadingState={true}
                  scalesPageToFit={true}
                />
              )}
            </View>
          </View>
        </View>
      </Modal>}
    </View>
  )
}

export default PatientDocumentScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    // paddingBottom: 20,
    marginBottom:100
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 30
  },
  headerContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  headerTitle: {
    ...typography.h2,
    textAlign: 'center',
    color: theme.colors.primary,
  },
  uhidText: {
    fontSize: width * 0.032,
    fontFamily: 'Poppins-Regular',
    color: '#999',
    textAlign:'center',
    marginTop: 2,
  },
  head: { height: 40, },
  text: { margin: 2, textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'center' },
  cell: { flex: 1, justifyContent: 'center', padding: 8 },
  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 0.7,
    height: '100%',
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: 30,
  },
  sidebarTitle: {
    ...typography.h3,
    color: theme.colors.primary,
  },
  categoriesList: {
    padding: width * 0.04,
  },
  categoryItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryText: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  iconButton: {
    padding: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    ...typography.h3,
    color: theme.colors.primary,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalLabel: {
    ...typography.h4,
    color: theme.colors.primary,
    marginBottom: 10,
  },
  modalText: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    marginBottom: 5,
  },
  documentModalContent: {
    width: width * 0.9,
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  documentModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  documentModalTitle: {
    ...typography.h3,
    color: theme.colors.primary,
  },
  documentViewer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  documentImage: {
    width: '100%',
    height: '100%',
  },
  documentWebView: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  cancelButtonText: {
    color: theme.colors.primary,
    fontFamily: 'Poppins-Regular',
  },
  scheduleButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  scheduleButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    width: '100%',
  },
  paginationButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationText: {
    marginHorizontal: 15,
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    color: theme.colors.primary,
    paddingHorizontal:10
  },
  selectedCategoryItem: {
    backgroundColor: theme.colors.primary + '15',

    
  },
  selectedCategoryText: {
    color: theme.colors.primary,
    paddingHorizontal:10,
    fontSize: width * 0.035,
    fontFamily: 'Poppins-SemiBold',

  },
  noDocumentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noDocumentsText: {
    ...typography.h3,
    color: theme.colors.primary,
    marginTop: 16,
    marginBottom: 8,
  },
  noDocumentsSubText: {
    fontSize: width * 0.035,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
})
