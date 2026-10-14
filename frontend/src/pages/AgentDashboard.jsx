import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Building2, 
  Briefcase, 
  UserCheck, 
  Calendar, 
  Sparkles, 
  AlertCircle, 
  Send, 
  FileCheck, 
  Edit3, 
  Eye, 
  ThumbsUp, 
  ThumbsDown,
  PlusCircle
} from 'lucide-react';

export default function AgentDashboard({ data }) {
  const [activeTab, setActiveTab] = useState('taches'); // 'taches', 'offres', 'mer', 'coaching', 'insertions'
  const [offresState, setOffresState] = useState(data.offres);
  const [selectedOffreForMer, setSelectedOffreForMer] = useState(1);
  const [merSuccessToast, setMerSuccessToast] = useState(null);

  // Agent connecté de démonstration : Marc Bernard (AGT-001)
  const agentInfo = data.agents[0];

  // Actions de validation d'offre par l'agent
  const validerOffre = (id) => {
    setOffresState(offresState.map(o => o.id === id ? { ...o, statut: 'publiee' } : o));
    setMerSuccessToast(`L'offre a été validée et publiée sur le catalogue du salon !`);
    setTimeout(() => setMerSuccessToast(null), 3500);
  };

  const refuserOffre = (id) => {
    setOffresState(offresState.map(o => o.id === id ? { ...o, statut: 'brouillon' } : o));
    setMerSuccessToast(`Demande de modifications envoyée à l'entreprise.`);
    setTimeout(() => setMerSuccessToast(null), 3500);
  };

  const declencherMer = (deNom, score) => {
    setMerSuccessToast(`Mise en relation transmise pour ${deNom} (Score de correspondance : ${score}%) !`);
    setTimeout(() => setMerSuccessToast(null), 3500);
  };

  return (
    <div className="main-content">
      {/* Entête du tableau de bord Agent */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-success">Portefeuille Agent Opérationnel</span>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Matricule : {agentInfo.matricule}</span>
          </div>
          <h1>Espace Conseiller : {agentInfo.prenom} {agentInfo.nom}</h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Affectation : <strong>{agentInfo.pole}</strong> — Suivi personnalisé de mes entreprises et candidats.
          </p>
        </div>

        {/* Navigation interne Agent */}
        <div style={{ display: 'flex', gap: '0.4rem', background: '#E2E8F0', padding: '0.25rem', borderRadius: '10px', flexWrap: 'wrap' }}>
          <button 
            className={`btn btn-sm ${activeTab === 'taches' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('taches')}
          >
            <Clock size={15} /> Tâches du Jour
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'offres' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('offres')}
          >
            <Briefcase size={15} /> Offres à Valider ({offresState.filter(o => o.statut === 'en_validation').length})
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'mer' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('mer')}
          >
            <Sparkles size={15} /> Moteur MER & Matching
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'coaching' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('coaching')}
          >
            <Edit3 size={15} /> Fiches Coaching
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'insertions' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setActiveTab('insertions')}
          >
            <CheckCircle2 size={15} /> Suivi Insertions (Relances)
          </button>
        </div>
      </div>

      {/* Toast d'action */}
      {merSuccessToast && (
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
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{merSuccessToast}</span>
        </div>
      )}

      {/* JAUGES PERSONNELLES D'OBJECTIFS DE L'AGENT */}
      <div className="grid-kpis">
        <div className="kpi-card" style={{ '--kpi-color': '#2563EB', '--kpi-bg': '#EFF6FF' }}>
          <div className="kpi-icon-box">
            <Building2 size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="kpi-label">ENTREPRISES PORTEFEUILLE</div>
            <div className="kpi-value">4 <span style={{ fontSize: '0.9rem', color: '#64748B' }}>/ 4 cible</span></div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '100%', background: '#2563EB' }} />
            </div>
            <div className="kpi-progress">Objectif atteint (100%)</div>
          </div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': '#059669', '--kpi-bg': '#ECFDF5' }}>
          <div className="kpi-icon-box">
            <Briefcase size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="kpi-label">OFFRES D'EMPLOI COLLECTÉES</div>
            <div className="kpi-value">{agentInfo.offres} <span style={{ fontSize: '0.9rem', color: '#64748B' }}>/ {agentInfo.cibleOffres} cible</span></div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${Math.round((agentInfo.offres / agentInfo.cibleOffres) * 100)}%`, background: '#10B981' }} />
            </div>
            <div className="kpi-progress">Objectif dépassé (+2 offres)</div>
          </div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': '#D97706', '--kpi-bg': '#FEF3C7' }}>
          <div className="kpi-icon-box">
            <UserCheck size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="kpi-label">CANDIDATS MIS EN RELATION (MER)</div>
            <div className="kpi-value">{agentInfo.de} <span style={{ fontSize: '0.9rem', color: '#64748B' }}>/ {agentInfo.cibleDe} cible</span></div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${Math.round((agentInfo.de / agentInfo.cibleDe) * 100)}%`, background: '#F59E0B' }} />
            </div>
            <div className="kpi-progress">285 candidats accompagnés</div>
          </div>
        </div>

        <div className="kpi-card" style={{ '--kpi-color': '#7C3AED', '--kpi-bg': '#F5F3FF' }}>
          <div className="kpi-icon-box">
            <CheckCircle2 size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="kpi-label">INSERTIONS CONFIRMÉES</div>
            <div className="kpi-value">{agentInfo.insertions} <span style={{ fontSize: '0.9rem', color: '#64748B' }}>/ {agentInfo.cibleInsertions} cible</span></div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${Math.round((agentInfo.insertions / agentInfo.cibleInsertions) * 100)}%`, background: '#8B5CF6' }} />
            </div>
            <div className="kpi-progress" style={{ color: '#7C3AED' }}>56% de l'objectif final</div>
          </div>
        </div>
      </div>

      {/* CONTENU ONGLETS */}

      {/* 1. TÂCHES DU JOUR */}
      {activeTab === 'taches' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {/* To-Do List */}
          <div className="card">
            <div className="card-header">
              <h3>Tâches Prioritaires du Jour</h3>
              <span className="badge badge-warning">À traiter aujourd'hui</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: '#F8FAFC', borderRadius: '10px', borderLeft: '4px solid #D97706' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Offre en attente de validation</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>NovaTech Solutions — Technicien Support N2</div>
                </div>
                <button onClick={() => setActiveTab('offres')} className="btn btn-sm btn-primary">
                  Examiner
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: '#F8FAFC', borderRadius: '10px', borderLeft: '4px solid #2563EB' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Entretien aujourd'hui à 09h30</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Yacine Bensaid @ Stand A-01 (NovaTech)</div>
                </div>
                <span className="badge badge-success">Stand A-01</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem', background: '#F8FAFC', borderRadius: '10px', borderLeft: '4px solid #10B981' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Relance Insertion J+30 échue</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Sarah Mansouri — Clinique Saint-Jean (CDI)</div>
                </div>
                <button onClick={() => setActiveTab('insertions')} className="btn btn-sm btn-secondary">
                  Valider Suivi
                </button>
              </div>
            </div>
          </div>

          {/* Agenda des Entretiens de mon Portefeuille */}
          <div className="card">
            <div className="card-header">
              <h3>Agenda Salon & Rendez-vous des Candidats</h3>
              <span className="badge badge-slate">Jour J du Salon</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {data.entretiens.map((ent) => (
                <div key={ent.id} style={{ padding: '0.85rem', border: '1px solid #E2E8F0', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <strong style={{ color: '#0F172A' }}>{ent.demandeurNom}</strong>
                    <span className="badge badge-info">{ent.dateHeure}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                    Poste : <strong>{ent.poste}</strong> ({ent.entrepriseNom})
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.35rem' }}>
                    Lieu : {ent.lieu}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. OFFRES À VALIDER */}
      {activeTab === 'offres' && (
        <div className="card">
          <div className="card-header">
            <h3>Offres d'Emploi de mon Portefeuille & Workflow de Validation</h3>
            <span className="badge badge-info">Validation en 1 clic</span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Réf. & Entreprise</th>
                  <th>Intitulé du Poste</th>
                  <th>Contrat & Niveau</th>
                  <th>Compétences Clés</th>
                  <th>Statut</th>
                  <th>Actions Conseiller</th>
                </tr>
              </thead>
              <tbody>
                {offresState.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong>{o.reference}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{o.entrepriseNom}</div>
                    </td>
                    <td>
                      <strong>{o.intitule}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{o.ville} ({o.postes} poste{o.postes > 1 ? 's' : ''})</div>
                    </td>
                    <td>
                      <span className="badge badge-slate">{o.contrat}</span>
                      <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>{o.niveau}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', maxWidth: '240px' }}>
                        {o.competences.map((c, idx) => (
                          <span key={idx} style={{ fontSize: '0.7rem', background: '#F1F5F9', padding: '1px 6px', borderRadius: '4px' }}>{c}</span>
                        ))}
                      </div>
                    </td>
                    <td>
                      {o.statut === 'publiee' && <span className="badge badge-success">Publiée</span>}
                      {o.statut === 'en_validation' && <span className="badge badge-warning">En Validation</span>}
                      {o.statut === 'brouillon' && <span className="badge badge-danger">Modifications demandées</span>}
                    </td>
                    <td>
                      {o.statut === 'en_validation' ? (
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => validerOffre(o.id)} className="btn btn-sm btn-success" title="Valider et publier">
                            <ThumbsUp size={14} /> Valider
                          </button>
                          <button onClick={() => refuserOffre(o.id)} className="btn btn-sm btn-secondary" title="Demander des corrections">
                            <ThumbsDown size={14} /> Refuser
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 600 }}>Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. MOTEUR MER & MATCHING */}
      {activeTab === 'mer' && (
        <div>
          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="#2563EB" /> Moteur de Matching Algorithmique MER (Score Continu 0-100%)
              </h3>
              <span className="badge badge-info">Pondération 50/25/15/10</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <label style={{ fontWeight: 600, fontSize: '0.9rem' }}>Sélectionner une offre de mon portefeuille :</label>
              <select 
                className="form-select" 
                style={{ maxWidth: '450px' }}
                value={selectedOffreForMer} 
                onChange={(e) => setSelectedOffreForMer(Number(e.target.value))}
              >
                {offresState.filter(o => o.statut === 'publiee').map(o => (
                  <option key={o.id} value={o.id}>
                    [{o.reference}] {o.intitule} — {o.entrepriseNom}
                  </option>
                ))}
              </select>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Le moteur compare automatiquement les 4 000 candidats avec les compétences requises, le rayon de mobilité, le niveau d'études et le contrat.
            </p>
          </div>

          <div className="card">
            <div className="card-header">
              <h4>Candidats les plus pertinents pour le poste sélectionné</h4>
              <span className="badge badge-success">Seuil de préconisation $\ge$ 65%</span>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Demandeur d'Emploi</th>
                    <th>Score MER Total</th>
                    <th>Détail du Score (Comp / Mob / Dip / Cont)</th>
                    <th>Compétences Clés</th>
                    <th>Mobilité / Ville</th>
                    <th>Action MER</th>
                  </tr>
                </thead>
                <tbody>
                  {data.demandeursEmploi.map((de) => {
                    // Calcul simulé dynamique selon l'offre
                    const isYacine = de.id === 1;
                    const score = isYacine ? 95 : (de.id === 3 ? 72 : 54);
                    const matchClass = score >= 75 ? 'match-high' : (score >= 65 ? 'match-medium' : 'match-low');

                    return (
                      <tr key={de.id}>
                        <td>
                          <strong>{de.nom} {de.prenom}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{de.numeroDe}</div>
                        </td>
                        <td>
                          <span className={`match-score-badge ${matchClass}`}>
                            <Sparkles size={12} /> {score}%
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                            {isYacine ? 'Comp: 50 | Mob: 25 | Dip: 15 | Cont: 5' : 'Comp: 32 | Mob: 25 | Dip: 10 | Cont: 5'}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '240px' }}>
                            {de.competences.slice(0, 4).map((c, i) => (
                              <span key={i} style={{ fontSize: '0.7rem', background: '#EFF6FF', color: '#1E40AF', padding: '1px 6px', borderRadius: '4px' }}>{c}</span>
                            ))}
                          </div>
                        </td>
                        <td>{de.ville} ({de.mobiliteKm} km)</td>
                        <td>
                          <button 
                            onClick={() => declencherMer(`${de.prenom} ${de.nom}`, score)}
                            className="btn btn-sm btn-primary"
                          >
                            <Send size={13} /> Proposer MER
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. FICHES COACHING */}
      {activeTab === 'coaching' && (
        <div className="card">
          <div className="card-header">
            <h3>Fiche de Coaching & Préparation Entretien DE</h3>
            <span className="badge badge-success">Candidat : Yacine Bensaid</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Points Forts Observés</label>
              <textarea 
                className="form-textarea" 
                rows={3} 
                defaultValue="Excellente maîtrise React/Laravel, portfolio GitHub très soigné, bon relationnel." 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Axes d'Amélioration pour l'Entretien</label>
              <textarea 
                className="form-textarea" 
                rows={3} 
                defaultValue="Synthétiser les réponses techniques pour respecter le temps d entretien court au salon (15 min chrono)." 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem', marginTop: '0.5rem' }}>
            <div className="form-group">
              <label className="form-label">Note de Simulation d'Entretien (/20)</label>
              <input type="number" className="form-input" defaultValue={17} max={20} min={0} />
            </div>

            <div className="form-group">
              <label className="form-label">Notes Confidentielles de l'Agent (Invisibles au DE)</label>
              <input 
                type="text" 
                className="form-input" 
                defaultValue="Candidat prioritaire, à recommander directement aux recruteurs NovaTech." 
              />
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: '1rem' }}>
            <button 
              onClick={() => {
                setMerSuccessToast("Fiche de coaching enregistrée avec succès !");
                setTimeout(() => setMerSuccessToast(null), 3000);
              }}
              className="btn btn-primary"
            >
              Enregistrer la Séance de Coaching
            </button>
          </div>
        </div>
      )}

      {/* 5. SUIVI DES INSERTIONS ET RELANCES */}
      {activeTab === 'insertions' && (
        <div className="card">
          <div className="card-header">
            <h3>Suivi Post-Salon des Insertions & Relances 1, 3 et 6 Mois</h3>
            <span className="badge badge-info">Portefeuille Personnel</span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Candidat Inséré</th>
                  <th>Entreprise & Poste</th>
                  <th>Contrat & Prise de Poste</th>
                  <th>Suivi à 1 Mois</th>
                  <th>Suivi à 3 Mois</th>
                  <th>Suivi à 6 Mois</th>
                  <th>Action Relance</th>
                </tr>
              </thead>
              <tbody>
                {data.insertions.map((ins) => (
                  <tr key={ins.id}>
                    <td><strong>{ins.deNom}</strong></td>
                    <td>
                      <strong>{ins.poste}</strong>
                      <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{ins.entreprise}</div>
                    </td>
                    <td>
                      <span className="badge badge-success">{ins.contrat}</span>
                      <div style={{ fontSize: '0.75rem', marginTop: '2px' }}>Depuis le {ins.datePrisePoste}</div>
                    </td>
                    <td>
                      {ins.statutSuivi1m === 'confirme_en_poste' ? (
                        <span className="badge badge-success">Confirmé en poste</span>
                      ) : (
                        <span className="badge badge-warning">À relancer</span>
                      )}
                    </td>
                    <td>
                      {ins.statutSuivi3m === 'confirme_en_poste' ? (
                        <span className="badge badge-success">Confirmé</span>
                      ) : (
                        <span className="badge badge-warning">À relancer</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-slate">En attente (J+180)</span>
                    </td>
                    <td>
                      <button 
                        onClick={() => {
                          setMerSuccessToast(`Point de suivi confirmé pour ${ins.deNom} ! Objectif crédité.`);
                          setTimeout(() => setMerSuccessToast(null), 3500);
                        }}
                        className="btn btn-sm btn-primary"
                      >
                        Valider Point de Suivi
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
