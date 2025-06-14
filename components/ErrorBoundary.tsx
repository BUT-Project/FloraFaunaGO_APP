import React from "react";
import { ErrorMessage } from "./ui/ErrorMessage";


type ErrorBoundaryProps = {
  children: React.ReactNode;
  page?: string; // Optionnel, pour identifier la page où l'erreur s'est produite
};

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  override state = { hasError: false, error: null };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  override componentDidCatch(error: any, info: any) {
    console.log("Caught by ErrorBoundary:", error, info);
  }

  override render() {
    if (this.state.hasError) {
      return <ErrorMessage 
                message={`Une erreur est survenue ${this.props.page? `dans la page "${this.props.page}" ` : ""}: \n${String(this.state.error)}`}
            />;
    }

    return this.props.children;
  }
}