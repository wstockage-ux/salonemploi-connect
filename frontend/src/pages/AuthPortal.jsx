import React, { useState } from 'react';
import { Briefcase, Lock, Mail, Eye, EyeOff, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AuthPortal({ onLoginSuccess }) {
  const [identifiant, setIdentifiant] = useState('coordination@salonemploi.fr');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotModal, setForgotModal] = useState(false);
  const [forgotMethod, setForgotMethod] = useState('email');
  const [forgotSent, setForgotSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Comptes de test rapides pour la démonstration
  const testAccounts = [
    { label: 'Admin / Coordination', email: 'coordination@salonemploi.fr', role: 'admin', desc: 'Vue 50 entreprises, 1 000 offres, 4 000 DE, 15 agents' },
    { label: 'Agent Opérationnel', email: 'agent.bernard@salonemploi.fr', role: 'agent', desc: 'Portefeuille AGT-001, tâches du jour, moteur MER' },
    { label: 'Entreprise Recruteur', email: 'rh@novatech-solutions.fr', role: 'entreprise', desc: 'Stand A-01, gestion des candidatures, créneaux' },
    { label: 'Candidat (DE)', email: 'yacine.b@email.fr', role: 'de', desc: 'DE-75-00123, matching en 1 clic, convocation salon' },
  ];

  const handleLogin = (e) => {
    if (e) e.preventDefault();

    // Détermination automatique du rôle pour la démo
    let role = 'admin';
    if (identifiant.includes('agent') || identifiant.includes('AGT')) role = 'agent';
    else if (identifiant.includes('rh@') || identifiant.includes('contact@')) role = 'entreprise';
    else if (identifiant.includes('yacine') || identifiant.includes('DE-')) role = 'de';

    onLoginSuccess(role);
  };

  const selectTestAccount = (acc) => {
    setIdentifiant(acc.email);
    setPassword('Password123!');
    onLoginSuccess(acc.role);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 10%, #1E3A8A 0%, #0B1E38 50%, #061121 100%)',
      padding: '1.5rem',
      position: 'relative'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
        width: '100%',
        maxWidth: '460px',
        padding: '2.25rem',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* En-tête de connexion */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '54px',
            height: '54px',
            background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            borderRadius: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginBottom: '0.85rem',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
          }}>
            <Briefcase size={28} />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: '#0F172A', fontWeight: 800 }}>
            SalonEmploi <span style={{ color: '#2563EB' }}>Connect</span>
          </h2>
          <p style={{ color: '#64748B', fontSize: '0.88rem', marginTop: '0.25rem' }}>
            Portail unique et sécurisé d'accès au salon de l'emploi
          </p>
        </div>

        {/* Formulaire de connexion */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Identifiant ou E-mail</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Ex: agent.bernard@salonemploi.fr ou DE-75-00123" 
                value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label className="form-label" style={{ margin: 0 }}>Mot de passe</label>
              <button 
                type="button" 
                onClick={() => setForgotModal(true)}
                style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="form-input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#475569' }}>
              <input 
                type="checkbox" 
                checked={rememberMe} 
                onChange={(e) => setRememberMe(e.target.checked)} 
              />
              Se souvenir de moi
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
            Se Connecter <ArrowRight size={16} />
          </button>
        </form>

        {/* Accès Démonstration Rapide par Profil */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem', textAlign: 'center' }}>
            Accès Rapide Démonstration (1 Clic)
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {testAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => selectTestAccount(acc)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.6rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#EFF6FF'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#F8FAFC'}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0F172A' }}>{acc.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{acc.desc}</div>
                </div>
                <ArrowRight size={14} color="#3B82F6" />
              </button>
            ))}
          </div>
        </div>

        {/* Protection RGPD */}
        <div style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.75rem', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <ShieldCheck size={14} color="#10B981" />
          <span>Protection des données personnelles (RGPD) & Hachage sécurisé</span>
        </div>
      </div>

      {/* Modale Mot de passe oublié */}
      {forgotModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem', zIndex: 100
        }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '1.75rem', maxWidth: '420px', width: '100%' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Réinitialisation du mot de passe</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
              Choisissez votre méthode de récupération pour recevoir un code temporaire sécurisé.
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button 
                type="button"
                className={`btn btn-sm ${forgotMethod === 'email' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setForgotMethod('email')}
                style={{ flex: 1 }}
              >
                Par E-mail
              </button>
              <button 
                type="button"
                className={`btn btn-sm ${forgotMethod === 'sms' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setForgotMethod('sms')}
                style={{ flex: 1 }}
              >
                Par SMS
              </button>
            </div>

            <div className="form-group">
              <label className="form-label">{forgotMethod === 'email' ? 'Adresse E-mail' : 'Numéro de Téléphone'}</label>
              <input 
                type="text" 
                className="form-input" 
                defaultValue={forgotMethod === 'email' ? 'yacine.b@email.fr' : '07 81 00 11 22'} 
              />
            </div>

            {forgotSent ? (
              <div style={{ background: '#ECFDF5', color: '#065F46', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <CheckCircle2 size={18} />
                <span>Code envoyé avec succès ! Vérifiez vos messages.</span>
              </div>
            ) : null}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button type="button" onClick={() => { setForgotModal(false); setForgotSent(false); }} className="btn btn-secondary">
                Fermer
              </button>
              <button 
                type="button" 
                onClick={() => setForgotSent(true)} 
                className="btn btn-primary"
              >
                Envoyer le code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
