import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  ShieldCheck, 
  BarChart3, 
  ArrowRight,
  Filter
} from 'lucide-react';

export default function AdminDashboard({ data }) {
  const [activeTab, setActiveTab] = useState('kpis'); // 'kpis', 'agents', 'exports', 'audit'
  const [exportNotification, setExportNotification] = useState(null);

  const stats = data.coordinationStats;
  const agents = data.agents;

  const triggerExport = (format, type) => {
    setExportNotification(`Génération de l'export ${type} au format ${format.toUpperCase()} en cours... Téléchargement prêt !`);
    setTimeout(() => {
      setExportNotification(null);
    }, 4000);
  };

  return (
    <div className="main-content">
      {/* Entête du tableau de bord */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-info">Portail Coordination</span>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Actualisation en direct</span>
          </div>
          <h1>Supervision Générale du Salon</h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Pilotage des 50 entreprises, 1 000 offres, 4 000 candidats et des 15 portefeuilles agents.
          </p>
        </div>

        {/* Onglets de navigation Admin */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#E2E8F0', padding: '0.25rem', borderRadius: '10px' }}>
          <button 
            className={`btn btn-sm ${activeTab === 'kpis' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('kpis')}
          >
            <BarChart3 size={15} /> Vue Globale
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'agents' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('agents')}
          >
            <Users size={15} /> Classement 15 Agents
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'exports' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('exports')}
          >
            <Download size={15} /> Centre d'Exports
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'audit' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('audit')}
          >
            <ShieldCheck size={15} /> Journal d'Audit
          </button>
        </div>
      </div>

      {/* Notification Toast d'Export */}
      {exportNotification && (
        <div style={{
          background: '#065F46',
          color: '#FFFFFF',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 4px 12px rgba(6, 95, 70, 0.25)'
        }}>
          <CheckCircle2 size={20} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{exportNotification}</span>
        </div>
      )}

      {/* 1. LES 4 GRANDES JAUGES DE COORDINATION */}
      <div className="grid-kpis">
        {/* Entreprises */}
        <div className="kpi-card" style={{ '--kpi-color': '#2563EB', '--kpi-bg': '#EFF6FF' }}>
          <div className="kpi-icon-box">
            <Building2 size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="kpi-label">ENTREPRISES PARTICIPANTES</div>
            <div className="kpi-value">{stats.entreprises.actuel} <span style={{ fontSize: '1rem', color: '#64748B' }}>/ {stats.entreprises.cible}</span></div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${stats.entreprises.pct}%`, background: '#2563EB' }} />
            </div>
            <div className="kpi-progress">100% de l'objectif atteint</div>
          </div>
        </div>

        {/* Offres collectées */}
        <div className="kpi-card" style={{ '--kpi-color': '#059669', '--kpi-bg': '#ECFDF5' }}>
          <div className="kpi-icon-box">
            <FileText size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="kpi-label">OFFRES D'EMPLOI COLLECTÉES</div>
            <div className="kpi-value">{stats.offres.actuel} <span style={{ fontSize: '1rem', color: '#64748B' }}>/ {stats.offres.cible}</span></div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${stats.offres.pct}%`, background: '#10B981' }} />
            </div>
            <div className="kpi-progress">Objectif 1 000 offres validées atteint</div>
          </div>
        </div>

        {/* Demandeurs d'emploi */}
        <div className="kpi-card" style={{ '--kpi-color': '#D97706', '--kpi-bg': '#FEF3C7' }}>
          <div className="kpi-icon-box">
            <Users size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="kpi-label">DEMANDEURS D'EMPLOI INSCRITS</div>
            <div className="kpi-value">{stats.demandeurs.actuel.toLocaleString()} <span style={{ fontSize: '1rem', color: '#64748B' }}>/ {stats.demandeurs.cible.toLocaleString()}</span></div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${stats.demandeurs.pct}%`, background: '#F59E0B' }} />
            </div>
            <div className="kpi-progress">4 000 profils prêts pour le matching</div>
          </div>
        </div>

        {/* Insertions confirmées */}
        <div className="kpi-card" style={{ '--kpi-color': '#7C3AED', '--kpi-bg': '#F5F3FF' }}>
          <div className="kpi-icon-box">
            <CheckCircle2 size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="kpi-label">INSERTIONS & EMBAUCHES EN COURS</div>
            <div className="kpi-value">{stats.insertions.actuel} <span style={{ fontSize: '1rem', color: '#64748B' }}>/ {stats.insertions.cible}</span></div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${stats.insertions.pct}%`, background: '#8B5CF6' }} />
            </div>
            <div className="kpi-progress" style={{ color: '#7C3AED' }}>Taux de conversion : 37.9%</div>
          </div>
        </div>
      </div>

      {activeTab === 'kpis' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
          {/* Entonnoir de conversion */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TrendingUp size={20} color="#2563EB" /> Entonnoir Opérationnel du Salon
              </h3>
              <span className="badge badge-slate">Pipeline Complet</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Étape 1 : Offres */}
              <div style={{ background: '#EFF6FF', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #2563EB' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, color: '#1E3A8A' }}>1. Offres Validées & Publiées</span>
                  <span style={{ fontWeight: 800 }}>1 000 offres</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#4B5563' }}>Vivier ouvert auprès des 50 entreprises</span>
              </div>

              {/* Flèche */}
              <div style={{ textAlign: 'center', color: '#94A3B8' }}>↓ Taux de candidature : 3.4 DE / offre</div>

              {/* Étape 2 : Candidatures */}
              <div style={{ background: '#F0FDF4', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #10B981' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, color: '#065F46' }}>2. Candidatures & MER Traitées</span>
                  <span style={{ fontWeight: 800 }}>3 420 candidatures</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#4B5563' }}>Spontanées et suggérées par les 15 agents</span>
              </div>

              {/* Flèche */}
              <div style={{ textAlign: 'center', color: '#94A3B8' }}>↓ Taux de convocation : 53.8%</div>

              {/* Étape 3 : Entretiens */}
              <div style={{ background: '#FFFBEB', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #F59E0B' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, color: '#92400E' }}>3. Entretiens Réalisés au Salon</span>
                  <span style={{ fontWeight: 800 }}>1 840 créneaux</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#4B5563' }}>Sur les stands entreprises et salons visio</span>
              </div>

              {/* Flèche */}
              <div style={{ textAlign: 'center', color: '#94A3B8' }}>↓ Taux d'embauche final : 15.4%</div>

              {/* Étape 4 : Embauches */}
              <div style={{ background: '#FAF5FF', padding: '1rem', borderRadius: '10px', borderLeft: '4px solid #8B5CF6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600, color: '#5B21B6' }}>4. Embauches & Périodes d'essai</span>
                  <span style={{ fontWeight: 800, color: '#047857' }}>284 recrutements confirmés</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: '#4B5563' }}>Suivi d'insertion en cours à 1, 3 et 6 mois</span>
              </div>
            </div>
          </div>

          {/* Alertes & Points de vigilance */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={20} color="#D97706" /> Alertes de Coordination en Direct
              </h3>
              <span className="badge badge-warning">2 alertes actives</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ border: '1px solid #FED7AA', background: '#FFF7ED', padding: '1rem', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <AlertTriangle size={18} color="#EA580C" />
                  <span style={{ fontWeight: 700, color: '#9A3412', fontSize: '0.9rem' }}>Offres sans aucun candidat (12 offres)</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#7C2D12', marginBottom: '0.5rem' }}>
                  Certaines offres en chaudronnerie et hôtellerie de nuit n'ont reçu aucune postulation. Déclencher un matching ciblé.
                </p>
                <button className="btn btn-sm btn-primary" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}>
                  Relancer les agents référents
                </button>
              </div>

              <div style={{ border: '1px solid #BFDBFE', background: '#EFF6FF', padding: '1rem', borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <ShieldCheck size={18} color="#2563EB" />
                  <span style={{ fontWeight: 700, color: '#1E40AF', fontSize: '0.9rem' }}>Taux de réponse des entreprises</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#1E3A8A' }}>
                  94% des entreprises ont validé leurs retours d'entretiens sous 48h. Très bon rythme de traitement.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TABLEAU DU CLASSEMENT DES 15 AGENTS */}
      {activeTab === 'agents' && (
        <div className="card">
          <div className="card-header">
            <h3>Progression et Portefeuille des 15 Agents Opérationnels</h3>
            <span className="badge badge-success">Tous les agents actifs</span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Agent & Matricule</th>
                  <th>Pôle d'Affectation</th>
                  <th>Offres Collectées</th>
                  <th>Candidats Portefeuille</th>
                  <th>Insertions Validées</th>
                  <th>Progression Globale</th>
                  <th>Statut Objectif</th>
                </tr>
              </thead>
              <tbody>
                {agents.map((agt) => {
                  const pct = Math.round(((agt.offres / agt.cibleOffres) + (agt.insertions / agt.cibleInsertions)) / 2 * 100);
                  const isDone = pct >= 80;
                  return (
                    <tr key={agt.id}>
                      <td>
                        <strong>{agt.prenom} {agt.nom}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{agt.matricule}</div>
                      </td>
                      <td>
                        <span className="badge badge-slate">{agt.pole}</span>
                      </td>
                      <td>
                        <strong>{agt.offres}</strong> / {agt.cibleOffres}
                        <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600 }}>
                          {Math.round((agt.offres / agt.cibleOffres) * 100)}%
                        </div>
                      </td>
                      <td>
                        <strong>{agt.de}</strong> / {agt.cibleDe}
                      </td>
                      <td>
                        <strong style={{ color: '#047857' }}>{agt.insertions}</strong> / {agt.cibleInsertions}
                      </td>
                      <td style={{ minWidth: '140px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600, marginBottom: '2px' }}>
                          <span>Avancement</span>
                          <span>{pct}%</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div className="progress-bar-fill" style={{ width: `${pct}%`, background: isDone ? '#10B981' : '#3B82F6' }} />
                        </div>
                      </td>
                      <td>
                        {isDone ? (
                          <span className="badge badge-success">Objectif Atteint</span>
                        ) : (
                          <span className="badge badge-info">En Cours</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CENTRE D'EXPORTS EXCEL / PDF / CSV */}
      {activeTab === 'exports' && (
        <div className="card">
          <div className="card-header">
            <h3>Centre de Génération & Exports Officiels du Salon</h3>
            <span className="badge badge-info">Conformité RGPD</span>
          </div>

          <p style={{ color: '#64748B', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Téléchargez les rapports consolidés du salon d'emploi aux formats standards pour les comités de direction et bailleurs.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ border: '1px solid #E2E8F0', padding: '1.25rem', borderRadius: '12px', background: '#F8FAFC' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Catalogue Exhaustif des 1 000 Offres</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1rem' }}>
                Fiche complète des 50 entreprises, intitulés, compétences, salaires et stands physiques.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => triggerExport('excel', 'Catalogue des Offres')} className="btn btn-sm btn-primary">
                  <Download size={14} /> Excel (.xlsx)
                </button>
                <button onClick={() => triggerExport('csv', 'Catalogue des Offres')} className="btn btn-sm btn-secondary">
                  CSV
                </button>
                <button onClick={() => triggerExport('pdf', 'Catalogue des Offres')} className="btn btn-sm btn-secondary">
                  PDF
                </button>
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', padding: '1.25rem', borderRadius: '12px', background: '#F8FAFC' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Rapport du Bilan d'Insertion & Post-Salon</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1rem' }}>
                Synthèse des 284 embauches, taux de maintien à 1, 3 et 6 mois par secteur et agent.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => triggerExport('pdf', 'Bilan d Insertion')} className="btn btn-sm btn-success">
                  <Download size={14} /> Rapport Officiel PDF
                </button>
                <button onClick={() => triggerExport('excel', 'Bilan d Insertion')} className="btn btn-sm btn-secondary">
                  Excel
                </button>
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', padding: '1.25rem', borderRadius: '12px', background: '#F8FAFC' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>Statistiques des 15 Agents</h4>
              <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '1rem' }}>
                Volume d'offres sourcées, de MER déclenchées et taux de réalisation des quotas.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => triggerExport('excel', 'KPIs Agents')} className="btn btn-sm btn-primary">
                  <Download size={14} /> Télécharger (.xlsx)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. JOURNAL D'AUDIT ET CONNEXIONS */}
      {activeTab === 'audit' && (
        <div className="card">
          <div className="card-header">
            <h3>Journal des Connexions & Traçabilité de Sécurité</h3>
            <span className="badge badge-info">Table journal_connexions</span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Horodatage</th>
                  <th>Utilisateur / Identifiant</th>
                  <th>Adresse IP</th>
                  <th>Navigateur / Terminal</th>
                  <th>Statut</th>
                  <th>Motif</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>12/10/2026 à 15:38:12</td>
                  <td><strong>coordination@salonemploi.fr</strong></td>
                  <td><code>192.168.1.10</code></td>
                  <td>Desktop Chrome 120.0 (Win64)</td>
                  <td><span className="badge badge-success">Succès</span></td>
                  <td>Session active</td>
                </tr>
                <tr>
                  <td>12/10/2026 à 15:35:44</td>
                  <td><strong>agent.bernard@salonemploi.fr</strong></td>
                  <td><code>192.168.1.25</code></td>
                  <td>Mobile Safari 17.0 (iPhone)</td>
                  <td><span className="badge badge-success">Succès</span></td>
                  <td>Session mobile</td>
                </tr>
                <tr>
                  <td>12/10/2026 à 15:22:01</td>
                  <td><strong>rh@novatech-solutions.fr</strong></td>
                  <td><code>82.120.45.12</code></td>
                  <td>Desktop Safari 17.0 (Mac)</td>
                  <td><span className="badge badge-success">Succès</span></td>
                  <td>Portail entreprise</td>
                </tr>
                <tr>
                  <td>12/10/2026 à 14:48:33</td>
                  <td><strong>hacker_test@unknown.com</strong></td>
                  <td><code>45.142.120.8</code></td>
                  <td>Python Requests / Script</td>
                  <td><span className="badge badge-danger">Échec</span></td>
                  <td>Mot de passe invalide (Bloqué)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
