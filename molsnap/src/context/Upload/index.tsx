import { createContext, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal, useContext, useReducer } from 'react';

// 1. Create a context to hold the state
const UploadContext = createContext<{ data: any; preview: any; parsed: any, dispatch: React.Dispatch<{ type: any, payload: any }> }>({
    data: {},
    preview: {
        filetype: '',
        startPage: 1,
        endPage: 2
    },
    parsed: [
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_0.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_1.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_2.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_3.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_4.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_5.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_6.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_7.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_8.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_9.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_10.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_11.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_12.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_13.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_14.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_15.png"
    ],
    dispatch: () => { },
});

// 2. Define the initial state
const initialState = {
    data: {},
    preview: {
        filetype: '',
        startPage: 1,
        endPage: 2
    },
    parsed: [
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_0.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_1.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_2.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_3.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_4.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_5.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_6.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_7.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_8.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_9.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_10.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_11.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_12.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_13.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_14.png",
        "images/segments/fmicb-10-00952_20251001033112_extracted_orig_15.png"
    ],
}

// 3. Define the reducer function to handle state transitions
const reducer = (state: { data: any; preview: any; parsed: any; }, action: { type: any; payload: any }) => {
    const { type, payload } = action;
    switch (type) {
        case 'UPLOAD.UPDATE':
            return { ...state, data: { ...state.data, ...payload } };
        case 'UPLOAD.PREVIEW.UPDATE':
            return { ...state, preview: { ...state.preview, ...payload } };
        case 'UPLOAD.PARSED.UPDATE':
            return { ...state, parsed: [...state.parsed, ...payload] };
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