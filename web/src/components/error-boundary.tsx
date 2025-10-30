'use client';

import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(): void {}

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-md px-4 pt-6 pb-20 min-h-screen bg-gray-50">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Что-то пошло не так</h1>
          <p className="text-gray-600 text-sm">Пожалуйста, перезагрузите страницу.</p>
        </div>
      );
    }
    return this.props.children;
  }
}


