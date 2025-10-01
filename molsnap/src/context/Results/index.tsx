import { createContext, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal, useContext, useReducer } from 'react';
import dummyResults from './results.json';
import { API_ENDPOINTS } from '@constants';

const initialResults = [
    {
        "id": "yvl4us2cg",
        "fileName": "MolSnap.png",
        "imageUrl": "blob:http://localhost:5173/c7a4e28b-1cf5-4a1c-b2d4-4afcba188b77",
        "smiles": "Nc1ccc(cc1)C(=O)O",
        "selfies": "[N][c][c][c][c][Branch1][=Branch1][c][c][Ring1][=Branch1][C][=Branch1][C][=O][O]",
        "confidence": 92,
        "format": "SMILES",
        "status": "success",
        "processingTime": 2.2
    },
    {
        "id": "yvl4us2cg",
        "fileName": "MolSnap.png",
        "imageUrl": "blob:http://localhost:5173/c7a4e28b-1cf5-4a1c-b2d4-4afcba188b77",
        "smiles": "Nc1ccc(cc1)C(=O)O",
        "selfies": "[N][c][c][c][c][Branch1][=Branch1][c][c][Ring1][=Branch1][C][=Branch1][C][=O][O]",
        "confidence": 92,
        "format": "SMILES",
        "status": "success",
        "processingTime": 2.2
    }
];

// 1. Create a context to hold the state
const ResultsContext = createContext<{ results: any; dispatch: React.Dispatch<{ type: any, payload: any }> }>({
    results: initialResults,
    dispatch: () => { },
});

// 2. Define the initial state
const initialState = {
    results: initialResults,
};

const reducer = (state: { results: any; }, action: { type: any; payload: any }) => {
    const { type, payload } = action;
    switch (type) {
        case 'RESULTS.UPDATE':
            const formattedResults = payload.map((item: any) => {
                const confidences = item.atom_sets?.map((a: any) => a.confidence) ?? [];
                const meanConfidence = confidences.length
                    ? Math.round(confidences.reduce((sum: number, val: number) => sum + val, 0) / confidences.length * 100)
                    : undefined;
                return {
                    id: item.filename,
                    fileName: item.filename,
                    imageUrl: `${API_ENDPOINTS.DECIMER_API_URL}/${item.filepath}`,
                    smiles: item.predicted_smiles,
                    selfies: item.predicted_smiles,
                    confidence: meanConfidence,
                    format: 'SMILES',
                    status: 'success',
                    processingTime: item.processing_time,
                };
            });
            return { ...state, results: formattedResults };
        default:
            throw new Error();
    }
};

// 4. Create a provider component
export const ResultsProvider = (props: { children: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <ResultsContext.Provider value={{ ...state, dispatch }}>
            {props.children}
        </ResultsContext.Provider>
    );
}

// Create a function that invokes the context
export const useResultsContext = () => {
    return useContext(ResultsContext)
}