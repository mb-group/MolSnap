import { createContext, type JSXElementConstructor, type ReactElement, type ReactNode, type ReactPortal, useContext, useReducer } from 'react';
import { data } from 'react-router';



// 1. Create a context to hold the state
const LoadingContext = createContext<{ isLoading: boolean; data: any; dispatch: React.Dispatch<{ type: any, payload: any }> }>({
    isLoading: false,
    data: {},
    dispatch: () => { },
});

// 2. Define the initial state
const initialState = {
    isLoading: false,
    data: {}
}

// 3. Define the reducer function to handle state transitions
const reducer = (state: { isLoading: boolean; data: any; }, action: { type: any; payload: any }) => {
    const { type, payload } = action;
    switch (type) {
        case 'LOADING.UPDATE':
            return { ...state, ...payload };
        default:
            throw new Error();
    }
};

// 4. Create a provider component
export const LoadingProvider = (props: { children: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <LoadingContext.Provider value={{ ...state, dispatch }}>
            {props.children}
        </LoadingContext.Provider>
    );
}

// Create a function that invokes the context
export const useLoadingContext = () => {
    return useContext(LoadingContext)
}