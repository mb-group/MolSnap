import { createContext, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal, useContext, useReducer } from 'react';

// 1. Create a context to hold the state
const UploadContext = createContext<{ data: any; preview: any; dispatch: React.Dispatch<{ type: any, payload: any }> }>({
    data: {},
    preview: {
        filetype: '',
        startPage: 1,
        endPage: 2
    },
    dispatch: () => { },
});

// 2. Define the initial state
const initialState = {
    data: {},
    preview: {
        filetype: '',
        startPage: 1,
        endPage: 2
    }
}

// 3. Define the reducer function to handle state transitions
const reducer = (state: { data: any; preview: any; }, action: { type: any; payload: any }) => {
    const { type, payload } = action;
    switch (type) {
        case 'UPLOAD.UPDATE':
            return { ...state, data: { ...state.data, ...payload } };
        case 'UPLOAD.PREVIEW.UPDATE':
            return { ...state, preview: { ...state.preview, ...payload } };
        default:
            throw new Error();
    }
};

// 4. Create a provider component
export const UploadProvider = (props: { children: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <UploadContext.Provider value={{ ...state, dispatch }}>
            {props.children}
        </UploadContext.Provider>
    );
}

// Create a function that invokes the context
export const useUploadContext = () => {
    return useContext(UploadContext)
}