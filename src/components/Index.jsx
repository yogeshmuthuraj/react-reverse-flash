import React, { useState } from 'react';
import About from './About';
import AppBarDrawer from './AppBarDrawer';
import Apps from './Apps/Main/Apps';
import Contribute from './Contribute';
import Notifications from './Notifications/Notifications';
import Settings from './Settings';

const Index = () => {
  // awaits for new relic api calls , curl commands
  const [currentSelected, setCurrentSelected] = useState('Apps');
  let pageContent;

  function pages(name: string) {
    switch (name) {
      case 'Apps':
        pageContent = <Apps />;
        break;
      case 'Notifications':
        pageContent = <Notifications />;
        break;
      case 'Settings':
        pageContent = <Settings />;
        break;
      case 'Contribute':
        pageContent = <Contribute />;
        break;
      case 'About':
        pageContent = <About />;
        break;
      default:
        break;
    }
  }

  function handlePageChange(name: string) {
    setCurrentSelected(name);
  }

  pages(currentSelected);

  return (
    <div>
      <AppBarDrawer
        currentSelected={currentSelected}
        pageContent={pageContent}
        handlePageChange={handlePageChange}
      />
    </div>
  );
};

export default Index;
