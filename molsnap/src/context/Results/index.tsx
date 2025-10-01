import { createContext, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal, useContext, useReducer } from 'react';

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

// 3. Define the reducer function to handle state transitions
const reducer = (state: { results: any; }, action: { type: any; payload: any }) => {
    const { type, payload } = action;
    switch (type) {
        case 'RESULTS.UPDATE':
            return { ...state, results: payload };
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