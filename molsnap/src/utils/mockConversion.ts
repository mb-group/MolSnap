// Mock chemical structure to SMILES conversion
// In a real application, this would connect to an AI model or chemical recognition service
import axios from 'axios';

export interface ConversionResult {
  id: string;
  fileName: string;
  imageUrl: string;
  smiles: string;
  selfies: string;
  confidence: number;
  format: 'SMILES' | 'SELFIES' | 'SDF';
  status: 'success' | 'warning' | 'error';
  processingTime: number;
}

// Sample SMILES codes for different types of chemical structures
const sampleSMILES = [
  "CCO", // Ethanol
  "CC(=O)O", // Acetic acid
  "c1ccccc1", // Benzene
  "CCc1ccccc1", // Ethylbenzene
  "CC(C)O", // Isopropanol
  "c1ccc2c(c1)cccn2", // Quinoline
  "CC(C)(C)c1ccc(cc1)O", // Butylated hydroxytoluene
  "Nc1ccc(cc1)C(=O)O", // Para-aminobenzoic acid
  "CCN(CC)C(=O)c1ccc(cc1)N", // Procaine
  "COc1ccc(cc1)C=O" // Anisaldehyde
];

const sampleSELFIES = [
  "[C][C][O]",
  "[C][C][=Branch1][C][=O][O]",
  "[c][c][c][c][c][c][Ring1][=Branch1]",
  "[C][C][c][c][c][c][c][c][Ring1][=Branch1]",
  "[C][C][Branch1][C][C][O]",
  "[c][c][c][c][c][Branch1][=Branch1][c][Ring1][=Branch1][c][c][c][n][Ring1][=Branch2]",
  "[C][C][Branch1][C][C][Branch1][C][C][c][c][c][c][Branch1][=Branch1][c][c][Ring1][=Branch1][O]",
  "[N][c][c][c][c][Branch1][=Branch1][c][c][Ring1][=Branch1][C][=Branch1][C][=O][O]",
  "[C][C][N][Branch1][Ring1][C][C][C][=Branch1][C][=O][c][c][c][c][Branch1][=Branch1][c][c][Ring1][=Branch1][N]",
  "[C][O][c][c][c][c][Branch1][=Branch1][c][c][Ring1][=Branch1][C][=O]"
];

const handleUpload = async (selectedFile: string | Blob) => {
  if (!selectedFile) {
    alert('Please select a file first!');
    return;
  }

  const formData = new FormData();
  formData.append('file', selectedFile); // 'file' must match the parameter name in FastAPI

  try {
    const response = await axios.post('http://localhost:8000/uploadfile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads
      },
    });
    console.log('Upload successful:', response.data);
    alert('File uploaded successfully!');
  } catch (error) {
    console.error('Error uploading file:', error);
    alert('Error uploading file.');
  }
};

export async function mockConvertToSMILES(file: File): Promise<ConversionResult> {

  await handleUpload(file); // Upload the first file as an example

  // Simulate processing time
  const processingTime = Math.random() * 3 + 1; // 1-4 seconds
  await new Promise(resolve => setTimeout(resolve, processingTime * 1000));

  // Create a blob URL for the uploaded image
  const imageUrl = URL.createObjectURL(file);

  // Randomly select a SMILES and SELFIES pair
  const randomIndex = Math.floor(Math.random() * sampleSMILES.length);
  const smiles = sampleSMILES[randomIndex];
  const selfies = sampleSELFIES[randomIndex];

  // Generate mock confidence score (85-99% for success, 60-84% for warning)
  const isSuccess = Math.random() > 0.15; // 85% success rate
  const confidence = isSuccess
    ? Math.floor(Math.random() * 15) + 85 // 85-99%
    : Math.floor(Math.random() * 25) + 60; // 60-84%

  const status = isSuccess ? 'success' : 'warning';

  return {
    id: Math.random().toString(36).substr(2, 9),
    fileName: file.name,
    imageUrl,
    smiles,
    selfies,
    confidence,
    format: 'SMILES',
    status,
    processingTime: Math.round(processingTime * 10) / 10
  };
}

// Function to batch convert multiple files
export async function batchConvertToSMILES(files: File[]): Promise<ConversionResult[]> {
  const results: ConversionResult[] = [];
  
  for (const file of files) {
    await handleUpload(file); // Upload the first file as an example
    const result = await mockConvertToSMILES(file);
    results.push(result);
  }

  return results;
}