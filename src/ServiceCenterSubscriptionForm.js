import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import instance from './api';

const PageContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const FormContainer = styled.div`
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-right: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const InstructionsContainer = styled.div`
  width: 300px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Textarea = styled.textarea`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const InstructionList = styled.ul`
  list-style-type: disc;
  padding-left: 20px;
`;

const AlertBox = styled.div`
  background-color: #e7f3fe;
  border: 1px solid #b6d4fe;
  border-radius: 4px;
  padding: 10px;
  margin-top: 20px;
  display: flex;
  align-items: flex-start;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`;

const MultiSelect = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  height: 100px;
`;

const ServiceCenterSubscriptionForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dob: '',
    govId: '',
    govIdType: '',
    agricultureQualification: '',
    educationLevel: '',
    status: '',
    zipCode: '',
    fullAddress: '',
    userRecord: '',
    yearsOfBusinessExperience: '',
    officeSpaceAvailable: '',
    manPowerAvailable: '',
    state: '',
    district: '',
    zonesRequested: []
  });


  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [zones, setZones] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await instance.get("https://dev287265.service-now.com/api/now/table/x_1433219_hortiur_state?sysparm_fields=state");
        const stateList = response.data.result.map(item => item.state);
        setStates(stateList);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  const fetchDistricts = async (state) => {
    window.console.log("check the state "+state);
    try {
      const response = await instance.get("https://dev287265.service-now.com/api/now/table/x_1433219_hortiur_district", {
        params: {
          sysparm_fields: 'district',
          sysparm_query: "stateLIKE"+state
        }
      });
      const districtList = response.data.result.map(item => item.district);
      setDistricts(districtList);
      window.console.log("the district list is "+districtList);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchZones = async (district) => {
    try {
      const response = await instance.get("https://dev287265.service-now.com/api/now/table/x_1433219_hortiur_zones", {
        params: {
          sysparm_fields: 'zones',
          sysparm_query: 'districtLIKE'+district
        }
      });
      const zoneList = response.data.result.map(item => item.zones);
      setZones(zoneList);
      window.console.log("the zone list is "+zoneList);
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setFormData(prevState => ({ ...prevState, [name]: value, district: '', zonesRequested: [] }));
      fetchDistricts(value);
    } else if (name === 'district') {
      setFormData(prevState => ({ ...prevState, [name]: value, zonesRequested: [] }));
      fetchZones(value);
    } else if (name === 'zonesRequested') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prevState => ({ ...prevState, [name]: selectedOptions }));
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const formatDataForSubmission = (data) => {
    return {
      state: data.state,
      district: data.district,
      zones_requested: data.zonesRequested.join(','),
      agriculture_qualification_if_any: data.agricultureQualification,
      agriculture_experience: "", // You may want to add this field to your form
      country_code: "", // You may want to add this field to your form
      dob: data.dob,
      first_name: data.firstName,
      last_name: data.lastName,
      gov_id: data.govId,
      gov_id_type: data.govIdType,
      full_address: data.fullAddress,
      phone_number: data.phoneNumber,
      years_of_business_experience: data.yearsOfBusinessExperience,
      man_power_available: data.manPowerAvailable,
      office_space_available: data.officeSpaceAvailable,
      zip_code: data.zipCode,
      education_level: data.educationLevel,
      email: data.email
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedData = formatDataForSubmission(formData);
    console.log('Formatted data for submission:', formattedData);

    try {
      const response = await instance.post(
        "https://dev287265.service-now.com/api/now/table/x_1433219_hortiur_service_centers?sysparm_input_display_value=True",
        formattedData
      );
      console.log('Form submitted successfully:', response.data);
      setModalMessage('Application Submitted Successfully!');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/homepage');
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setModalMessage('Error submitting application. Please try again.');
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
      }, 2000);
    }
  };



  return (
    <PageContainer>
      <FormContainer>
        <Title>Service Center Subscription</Title>
        <form onSubmit={handleSubmit}>
          <FormGrid>
            <FormField>
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
            </FormField>
            <FormField>
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
            </FormField>
            <FormField>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
            </FormField>
            <FormField>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </FormField>
            <FormField>
              <Label htmlFor="dob">DOB</Label>
              <Input id="dob" name="dob" type="date" value={formData.dob} onChange={handleChange} />
            </FormField>
            <FormField>
              <Label htmlFor="govIdType">Gov ID Type</Label>
              <Select id="govIdType" name="govIdType" value={formData.govIdType} onChange={handleChange}>
                <option value="">-- None --</option>
                <option value="Adhaar">Adhaar</option>
                <option value="Passport">Passport</option>
                {/* Add other ID types as needed */}
              </Select>
            </FormField>
            <FormField>
              <Label htmlFor="govId">Gov ID</Label>
              <Input id="govId" name="govId" value={formData.govId} onChange={handleChange} />
            </FormField>
            <FormField>
              <Label htmlFor="agricultureQualification">Agriculture Qualification (if any)</Label>
              <Input id="agricultureQualification" name="agricultureQualification" value={formData.agricultureQualification} onChange={handleChange} />
            </FormField>
            <FormField>
            <Label htmlFor="educationLevel">Education Level</Label>
            <Select id="educationLevel" name="educationLevel" value={formData.educationLevel} onChange={handleChange}>
              <option value="">-- None --</option>
              <option value="10th/12th">10th/12th</option>
              <option value="UG">UG</option>
              <option value="PG">PG</option>
            </Select>
          </FormField>
            <FormField>
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} />
            </FormField>
          </FormGrid>
          <FormField>
            <Label htmlFor="fullAddress">Full Address</Label>
            <Textarea id="fullAddress" name="fullAddress" value={formData.fullAddress} onChange={handleChange} />
          </FormField>
          <Title>Business Details</Title>
          <FormGrid>
          <FormField>
              <Label htmlFor="yearsOfBusinessExperience">Years of Business Experience</Label>
              <Select id="yearsOfBusinessExperience" name="yearsOfBusinessExperience" value={formData.yearsOfBusinessExperience} onChange={handleChange}>
                <option value="">-- None --</option>
                <option value="0">0</option>
                <option value="1-3 years">1-3 years</option>
                <option value="4+ years">4+ years</option>
              </Select>
            </FormField>
            <FormField>
              <Label htmlFor="officeSpaceAvailable">Office Space Available</Label>
              <Select id="officeSpaceAvailable" name="officeSpaceAvailable" value={formData.officeSpaceAvailable} onChange={handleChange}>
                <option value="">-- None --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
            </FormField>
            <FormField>
              <Label htmlFor="manPowerAvailable">Man Power Available</Label>
              <Select id="manPowerAvailable" name="manPowerAvailable" value={formData.manPowerAvailable} onChange={handleChange}>
                <option value="">-- None --</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </Select>
            </FormField>
            <FormField>
              <Label htmlFor="state">State</Label>
              <Select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="">-- Select a State --</option>
                {states.map((state, index) => (
                  <option key={index} value={state}>{state}</option>
                ))}
              </Select>
            </FormField>
            <FormField>
              <Label htmlFor="district">District</Label>
              <Select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                disabled={!formData.state}
              >
                <option value="">-- Select a District --</option>
                {districts.map((district, index) => (
                  <option key={index} value={district}>{district}</option>
                ))}
              </Select>
            </FormField>
            <FormField>
              <Label htmlFor="zonesRequested">Zones Requested(Hit ctrl and select multiple)</Label>
              <MultiSelect
                id="zonesRequested"
                name="zonesRequested"
                multiple
                value={formData.zonesRequested}
                onChange={handleChange}
                disabled={!formData.district}
              >
                {zones.map((zone, index) => (
                  <option key={index} value={zone}>{zone}</option>
                ))}
              </MultiSelect>
            </FormField>
          </FormGrid>

          <Button type="submit" style={{ marginTop: '20px', width: '100%' }}>Submit Application</Button>
        </form>
      </FormContainer>

      <InstructionsContainer>
        <Title>Instructions</Title>
        <InstructionList>
          <li>Fill out all required fields marked with an asterisk (*).</li>
          <li>Provide accurate contact information for future correspondence.</li>
          <li>List all types of services your company offers.</li>
          <li>Include relevant certifications to strengthen your application.</li>
          <li>Double-check all information before submitting.</li>
        </InstructionList>
        <AlertBox>
          <AlertCircle size={20} color="#0056b3" style={{ marginRight: '10px', flexShrink: 0 }} />
          <p style={{ fontSize: '14px', color: '#0056b3' }}>
            Your application will be reviewed within 5-7 business days. We'll contact you via email with further instructions or if we need additional information.
          </p>
        </AlertBox>
      </InstructionsContainer>

      {showModal && (
        <Modal>
          <ModalContent>
            <h2>{modalMessage}</h2>
            {modalMessage.includes('Successfully') && <p>Redirecting to homepage...</p>}
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default ServiceCenterSubscriptionForm;
