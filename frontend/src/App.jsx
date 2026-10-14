import React, { useState } from 'react';
import Navbar from './components/Navbar';
import AuthPortal from './pages/AuthPortal';
import AdminDashboard from './pages/AdminDashboard';
import AgentDashboard from './pages/AgentDashboard';
import EntrepriseDashboard from './pages/EntrepriseDashboard';
import DemandeurDashboard from './pages/DemandeurDashboard';
import { INITIAL_DATA } from './data/mockData';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentRole, setCurrentRole] = useState('admin'); // 'admin', 'agent', 'entreprise', 'de'
  const [data, setData] = useState(INITIAL_DATA);

  const handleLoginSuccess = (role) => {
    setCurrentRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleRoleChange = (newRole) => {
    setCurrentRole(newRole);
  };

  if (!isAuthenticated) {
    return <AuthPortal onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app-container">
      {/* Barre de navigation globale */}
      <Navbar 
        currentRole={currentRole} 
        onRoleChange={handleRoleChange} 
        onLogout={handleLogout} 
      />

      {/* Rendu dynamique selon le profil actif */}
      <main style={{ flex: 1 }}>
        {currentRole === 'admin' && <AdminDashboard data={data} />}
        {currentRole === 'agent' && <AgentDashboard data={data} />}
        {currentRole === 'entreprise' && <EntrepriseDashboard data={data} />}
        {currentRole === 'de' && <DemandeurDashboard data={data} />}
      </main>

      {/* Pied de page informatif */}
      <footer style={{
        background: '#0B1E38',
        color: '#94A3B8',
        fontSize: '0.8rem',
        padding: '1.25rem 1.5rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <strong>SalonEmploi Connect</strong> • Plateforme de Gestion de l'Emploi & Insertion Professionnelle
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>Dimensionnement : 50 Entreprises • 1 000 Offres • 4 000 DE • 15 Agents</span>
            <span style={{ color: '#10B981', fontWeight: 600 }}>● Mode Réseau Actif</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
