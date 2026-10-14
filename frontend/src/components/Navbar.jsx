import React from 'react';
import { Briefcase, UserCheck, Building2, User, ShieldAlert, LogOut, Bell, Wifi } from 'lucide-react';

export default function Navbar({ currentRole, onRoleChange, onLogout }) {
  const roles = [
    { code: 'admin', label: 'Coordination (Admin)', icon: ShieldAlert },
    { code: 'agent', label: 'Agent (Portefeuille)', icon: UserCheck },
    { code: 'entreprise', label: 'Entreprise', icon: Building2 },
    { code: 'de', label: 'Candidat (DE)', icon: User },
  ];

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-logo-icon">
          <Briefcase size={22} />
        </div>
        <div>
          <div className="brand-title">
            SalonEmploi <span>Connect</span>
          </div>
          <span className="brand-subtitle">Plateforme Opérationnelle du Salon</span>
        </div>
      </div>

      {/* Switcher de rôle interactif pour démonstration */}
      <div className="navbar-actions">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 600 }}>PROFIL ACTIF :</span>
          <div className="role-switcher-menu">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <button
                  key={r.code}
                  className={`role-switcher-btn ${currentRole === r.code ? 'active' : ''}`}
                  onClick={() => onRoleChange(r.code)}
                  title={`Basculer en vue ${r.label}`}
                >
                  <Icon size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '0.85rem' }}>
          <button
            className="btn btn-ghost btn-sm"
            style={{ color: '#E2E8F0', padding: '0.4rem', border: '1px solid rgba(255,255,255,0.15)' }}
            title="Connexion optimisée mode basse bande-passante"
          >
            <Wifi size={16} color="#10B981" />
          </button>
          <button
            onClick={onLogout}
            className="btn btn-ghost btn-sm"
            style={{ color: '#FDA4AF' }}
            title="Déconnexion"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
