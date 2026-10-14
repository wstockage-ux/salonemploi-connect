import React, { useState } from 'react';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Eye, 
  Phone, 
  Mail, 
  UserCheck, 
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function EntrepriseDashboard({ data }) {
  const [activeTab, setActiveTab] = useState('candidatures'); // 'candidatures', 'depot', 'planning', 'decisions'
  const [candidatures, setCandidatures] = useState(data.candidatures);
  const [selectedCv, setSelectedCv] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Entreprise connectée de démonstration : NovaTech Solutions
  const entreprise = data.entreprises[0];
  const agentReferent = data.agents[0];

  const updateStatut = (candidatureId, nouveauStatut) => {
    setCandidatures(candidatures.map(c => c.id === candidatureId ? { ...c, statut: nouveauStatut } : c));
    setToastMessage(`Statut de la candidature mis à jour : ${nouveauStatut.replace('_', ' ')}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="main-content">
      {/* Header Entreprise avec Fiche de l'Agent Référent */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-info">Portail Recruteur Entreprise</span>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Stand : {entreprise.stand}</span>
          </div>
          <h1>{entreprise.nom}</h1>
          <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
            Secteur : <strong>{entreprise.secteur}</strong> — {entreprise.ville}
          </p>
        </div>

        {/* Bloc Contact Agent Référent */}
        <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#2563EB', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#1E40AF', fontWeight: 600 }}>VOTRE CONSEILLER RÉFÉRENT</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{agentReferent.prenom} {agentReferent.nom}</div>
            <div style={{ fontSize: '0.75rem', color: '#475569' }}>06 01 00 00 01 • agent.bernard@salonemploi.fr</div>
          </div>
        </div>
      </div>

      {/* Navigation Interne Recruteur */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button 
          className={`btn ${activeTab === 'candidatures' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('candidatures')}
        >
          <Users size={16} /> Candidatures Reçues ({candidatures.length})
        </button>
        <button 
          className={`btn ${activeTab === 'depot' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('depot')}
        >
          <PlusCircle size={16} /> Déposer une Nouvelle Offre
        </button>
        <button 
          className={`btn ${activeTab === 'planning' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('planning')}
        >
          <Calendar size={16} /> Planning Entretiens au Stand ({data.entretiens.length})
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          background: '#065F46',
          color: '#FFFFFF',
          padding: '0.85rem 1.25rem',
          borderRadius: '10px',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <CheckCircle2 size={18} />
          <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{toastMessage}</span>
        </div>
      )}

      {/* 1. GESTION DES CANDIDATURES (VUE KANBAN / LISTE) */}
      {activeTab === 'candidatures' && (
        <div>
          <div className="card">
            <div className="card-header">
              <h3>Vivier des Candidats par Statut</h3>
              <span className="badge badge-success">CVs vérifiés par l'agent</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {candidatures.map((c) => (
                <div key={c.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div>
                      <strong style={{ fontSize: '1rem', color: '#0F172A' }}>{c.demandeurNom}</strong>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Postulé le {c.date}</div>
                    </div>
                    {c.score && (
                      <span className="match-score-badge match-high">
                        <Sparkles size={12} /> {c.score}% Match
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#334155', marginBottom: '0.75rem' }}>
                    Poste visé : <strong>{c.offreTitre}</strong>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '0.65rem', borderRadius: '8px', fontSize: '0.8rem', color: '#475569', marginBottom: '1rem', fontStyle: 'italic' }}>
                    "{c.lettre}"
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                      onClick={() => setSelectedCv(c.demandeurNom)}
                      className="btn btn-sm btn-ghost"
                      style={{ color: '#2563EB', fontWeight: 600 }}
                    >
                      <Eye size={14} /> Voir CV PDF
                    </button>

                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button 
                        onClick={() => updateStatut(c.id, 'entretien_programme')}
                        className="btn btn-sm btn-primary"
                      >
                        Créneau Entretien
                      </button>
                      <button 
                        onClick={() => updateStatut(c.id, 'retenue')}
                        className="btn btn-sm btn-success"
                      >
                        Retenir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. FORMULAIRE DE DÉPÔT D'OFFRE */}
      {activeTab === 'depot' && (
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="card-header">
            <h3>Dépôt d'une Nouvelle Offre d'Emploi</h3>
            <span className="badge badge-warning">Validation agent requise</span>
          </div>

          <form onSubmit={(e) => {
            e.preventDefault();
            setToastMessage("Offre soumise avec succès ! Elle a été transmise à votre conseiller pour validation.");
            setActiveTab('candidatures');
          }}>
            <div className="form-group">
              <label className="form-label">Intitulé du Poste</label>
              <input type="text" className="form-input" placeholder="Ex: Développeur Full-Stack, Chef d'équipe..." required defaultValue="Technicien Support Applicatif & Réseau" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Type de Contrat</label>
                <select className="form-select" defaultValue="CDI">
                  <option value="CDI">CDI (Contrat à Durée Indéterminée)</option>
                  <option value="CDD">CDD (Contrat à Durée Déterminée)</option>
                  <option value="Alternance">Alternance / Apprentissage</option>
                  <option value="Interim">Intérim</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Nombre de Postes Ouverts</label>
                <input type="number" className="form-input" defaultValue={1} min={1} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Niveau d'Études Minimum</label>
                <select className="form-select" defaultValue="Bac_2">
                  <option value="Sans_diplome">Sans diplôme</option>
                  <option value="CAP_BEP">CAP / BEP</option>
                  <option value="Bac">Baccalauréat</option>
                  <option value="Bac_2">Bac +2 (BTS, DUT)</option>
                  <option value="Bac_3">Bac +3 (Licence, Bachelor)</option>
                  <option value="Bac_5_plus">Bac +5 et plus</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Rémunération Brute Annuelle</label>
                <input type="text" className="form-input" defaultValue="28k - 32k €" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Compétences Clés Requises (séparées par des virgules)</label>
              <input type="text" className="form-input" defaultValue="Support N2, Réseaux, Windows, Linux, Relation client" required />
            </div>

            <div className="form-group">
              <label className="form-label">Description des Missions</label>
              <textarea className="form-textarea" rows={4} defaultValue="Au sein de notre équipe support, vous prenez en charge les tickets d'incidents utilisateurs de niveau 1 et 2, configurez les postes de travail et assistez nos clients." required />
            </div>

            <div style={{ textAlign: 'right', marginTop: '1.25rem' }}>
              <button type="submit" className="btn btn-primary">
                Soumettre à mon Agent Référent
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. PLANNING ENTRETIENS AU SALON */}
      {activeTab === 'planning' && (
        <div className="card">
          <div className="card-header">
            <h3>Planning des Entretiens sur votre Stand ({entreprise.stand})</h3>
            <span className="badge badge-success">Salon physique</span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Créneau Horaire</th>
                  <th>Candidat Présélectionné</th>
                  <th>Poste Visé</th>
                  <th>Modalité</th>
                  <th>Statut</th>
                  <th>Action Recruteur</th>
                </tr>
              </thead>
              <tbody>
                {data.entretiens.map((ent) => (
                  <tr key={ent.id}>
                    <td><strong>{ent.dateHeure}</strong></td>
                    <td><strong>{ent.demandeurNom}</strong></td>
                    <td>{ent.poste}</td>
                    <td><span className="badge badge-slate">{ent.modalite}</span></td>
                    <td><span className="badge badge-success">{ent.statut}</span></td>
                    <td>
                      <button 
                        onClick={() => {
                          setToastMessage(`Dossier d'embauche initié pour ${ent.demandeurNom} !`);
                        }}
                        className="btn btn-sm btn-success"
                      >
                        Valider Recrutement
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALE DU VISUALISEUR DE CV PDF */}
      {selectedCv && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '650px', width: '100%', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>Visualisation du Curriculum Vitae</h3>
                <span style={{ fontSize: '0.82rem', color: '#64748B' }}>Candidat : {selectedCv}</span>
              </div>
              <button onClick={() => setSelectedCv(null)} className="btn btn-ghost btn-sm">
                <X size={20} />
              </button>
            </div>

            <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '2rem', textAlign: 'center', background: '#F8FAFC', marginBottom: '1.25rem' }}>
              <FileText size={48} color="#2563EB" style={{ margin: '0 auto 0.75rem auto' }} />
              <h4 style={{ color: '#1E293B' }}>CV_{selectedCv.replace(' ', '_')}.pdf</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '0.25rem' }}>
                Document certifié conforme • Vérifié par l'Agent Référent du Salon
              </p>
              <div style={{ marginTop: '1rem', display: 'inline-flex', gap: '0.5rem', background: '#EFF6FF', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', color: '#1E40AF', fontWeight: 600 }}>
                Compétences validées : React, PHP, Laravel, MySQL, Git
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setSelectedCv(null)} className="btn btn-secondary">
                Fermer l'Aperçu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
