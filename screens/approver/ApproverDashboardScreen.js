import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Title, Button, List, Badge, Divider, Text, Surface } from 'react-native-paper';
import { theme } from '../../utils/theme';

export default function ApproverDashboardScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('proposals');

  // Mock data for approver
  const documentsForApproval = {
    proposals: [
      {
        id: '1',
        title: 'New Insurance Proposal',
        company: 'ABC Insurance',
        submittedDate: '2024-03-20',
        reviewedBy: 'Dr. Smith',
        reviewDate: '2024-03-21',
        status: 'reviewed',
        type: 'proposal',
        details: {
          proposedDiscount: '15%',
          coverageType: 'Comprehensive',
          unitName: 'Cardiology',
          reviewerComments: 'Terms are favorable, recommended for approval',
          attachments: ['proposal.pdf', 'review_notes.pdf']
        }
      }
    ],
    negotiations: [
      {
        id: '2',
        title: 'Rate Negotiation',
        company: 'XYZ Healthcare',
        submittedDate: '2024-03-19',
        reviewedBy: 'Dr. Johnson',
        reviewDate: '2024-03-20',
        status: 'reviewed',
        type: 'negotiation',
        details: {
          finalRate: '₹980,000',
          validityPeriod: '2 years',
          reviewerComments: 'Rate is within market standards',
          attachments: ['negotiation_summary.pdf']
        }
      }
    ],
    mous: [
      {
        id: '3',
        title: 'MoU Document',
        company: 'DEF Insurance',
        submittedDate: '2024-03-18',
        reviewedBy: 'Dr. Brown',
        reviewDate: '2024-03-19',
        status: 'reviewed',
        type: 'mou',
        details: {
          startDate: '2024-04-01',
          endDate: '2026-03-31',
          discountRate: '18%',
          reviewerComments: 'All terms are properly documented',
          attachments: ['mou_final.pdf']
        }
      }
    ],
    tariffs: []
  };

  // Mock data for counts
  const counts = {
    totalActive: Object.values(documentsForApproval).reduce(
      (acc, curr) => acc + (curr?.length || 0), 
      0
    ),
    proposals: documentsForApproval.proposals?.length || 0,
    negotiations: documentsForApproval.negotiations?.length || 0,
    mous: documentsForApproval.mous?.length || 0,
    tariffs: documentsForApproval.tariffs?.length || 0,
    pendingSignature: 3
  };

  const handleApproval = (document) => {
    navigation.navigate('FinalApproval', {
      documentData: {
        ...document,
        reviewDetails: {
          reviewedBy: document.reviewedBy,
          reviewDate: document.reviewDate,
          comments: document.details.reviewerComments
        }
      }
    });
  };

  const renderApprovalList = (documents) => {
    return documents.map((doc) => (
      <Card key={doc.id} style={styles.documentCard}>
        <Card.Content>
          <View style={styles.headerRow}>
            <Title>{doc.title || 'Untitled'}</Title>
            <Badge style={[styles.badge, { backgroundColor: theme.colors.primary, color: theme.colors.buttonText }]} >
              Reviewed
            </Badge>
          </View>
          
          <Text style={styles.subtitle}>
            {doc.company || 'Unknown'} - Reviewed by: {doc.reviewedBy || 'N/A'}
          </Text>
          
          <Surface style={styles.detailsSurface}>
            <Text style={styles.detailsText}>
              Submitted: {doc.submittedDate || 'N/A'}
            </Text>
            <Text style={styles.detailsText}>
              Reviewed: {doc.reviewDate || 'N/A'}
            </Text>
            <Text style={styles.detailsText}>
              Reviewer Comments: {doc.details?.reviewerComments || 'No comments'}
            </Text>

            {doc.details?.attachments && (
              <View style={styles.attachments}>
                <Text style={styles.attachmentTitle}>Attachments:</Text>
                {doc.details.attachments.map((file, index) => (
                  <Text key={index} style={styles.attachmentText}>
                    • {file}
                  </Text>
                ))}
              </View>
            )}
          </Surface>

          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => handleApproval(doc)}
              style={styles.approvalButton}
            >
              Review & Sign
            </Button>
          </View>
        </Card.Content>
      </Card>
    ));
  };

  const renderCountsCard = () => (
    <View style={styles.countsContainer}>
      <Card style={styles.countCard}>
        <Card.Content>
          <Title style={styles.countNumber}>{counts.totalActive}</Title>
          <Text style={styles.countLabel}>Total Pending</Text>
        </Card.Content>
      </Card>

      <Card style={styles.countCard}>
        <Card.Content>
          <Title style={styles.countNumber}>{counts.proposals}</Title>
          <Text style={styles.countLabel}>To Sign</Text>
        </Card.Content>
      </Card>

      <Card style={styles.countCard}>
        <Card.Content>
          <Title style={styles.countNumber}>{counts.negotiations}</Title>
          <Text style={styles.countLabel}>To Approve</Text>
        </Card.Content>
      </Card>

      <Card style={styles.countCard}>
        <Card.Content>
          <Title style={styles.countNumber}>{counts.pendingSignature}</Title>
          <Text style={styles.countLabel}>Pending Signature</Text>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {renderCountsCard()}

      <View style={styles.tabButtons}>
        <Button
          mode={activeTab === 'proposals' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('proposals')}
          style={styles.tabButton}
          labelStyle={activeTab === 'proposals' 
            ? { color: theme.colors.buttonText }  // White text when active
            : { color: theme.colors.primary }     // Pink text when inactive
          }
        >
          Proposals ({documentsForApproval.proposals?.length || 0})
        </Button>
        <Button
          mode={activeTab === 'negotiations' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('negotiations')}
          style={styles.tabButton}
          labelStyle={activeTab === 'negotiations' 
            ? { color: theme.colors.buttonText }  // White text when active
            : { color: theme.colors.primary }     // Pink text when inactive
          }
        >
          Negotiations ({documentsForApproval.negotiations?.length || 0})
        </Button>
        <Button
          mode={activeTab === 'mous' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('mous')}
          style={styles.tabButton}
          labelStyle={activeTab === 'mous' 
            ? { color: theme.colors.buttonText }  // White text when active
            : { color: theme.colors.primary }     // Pink text when inactive
          }
        >
          MoU ({documentsForApproval.mous?.length || 0})
        </Button>
        <Button
          mode={activeTab === 'tariffs' ? 'contained' : 'outlined'}
          onPress={() => setActiveTab('tariffs')}
          style={styles.tabButton}
          labelStyle={activeTab === 'tariffs' 
            ? { color: theme.colors.buttonText }  // White text when active
            : { color: theme.colors.primary }     // Pink text when inactive
          }
        >
          Tariffs ({documentsForApproval.tariffs?.length || 0})
        </Button>
      </View>

      {renderApprovalList(documentsForApproval[activeTab] || [])}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Approval Statistics</Title>
          <List.Section>
            <List.Item
              title="Pending Approvals"
              left={props => <List.Icon {...props} icon="clock" />}
              right={() => (
                <Badge size={25}>
                  {Object.values(documentsForApproval).reduce(
                    (acc, curr) => acc + curr.length,
                    0
                  )}
                </Badge>
              )}
            />
            <List.Item
              title="Approved Today"
              left={props => <List.Icon {...props} icon="check" />}
              right={() => <Badge size={25}>2</Badge>}
            />
            <List.Item
              title="High Priority"
              left={props => <List.Icon {...props} icon="alert" />}
              right={() => (
                <Badge size={25} style={{ backgroundColor: '#ff4444' }}>1</Badge>
              )}
            />
          </List.Section>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  tabButtons: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tabButton: {
    width: '48%',
    marginBottom: 16,
  },
  documentCard: {
    margin: 16,
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  detailsSurface: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    marginVertical: 8,
  },
  detailsText: {
    fontSize: 14,
    marginBottom: 8,
  },
  attachments: {
    marginTop: 8,
  },
  attachmentTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  attachmentText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  approvalButton: {
    backgroundColor: '#4CAF50',
  },
  badge: {
    alignSelf: 'center',
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  countsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    justifyContent: 'space-between',
  },
  countCard: {
    width: '48%',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  countNumber: {
    fontSize: 24,
    color: theme.colors.primary,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  countLabel: {
    textAlign: 'center',
    color: '#666',
  },
}); 