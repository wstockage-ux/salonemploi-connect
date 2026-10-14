import React, { useState } from 'react';
import { 
  User, 
  Briefcase, 
  Clock, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Sparkles, 
  Upload, 
  ShieldCheck, 
  Send, 
  FileText, 
  Search,
  Filter
} from 'lucide-react';

export default function DemandeurDashboard({ data }) {
  const [activeTab, setActiveTab] = useState('offres'); // 'accueil', 'offres', 'profil', 'candidatures', 'rgpd'
  const [candidatures, setCandidatures] = useState(data.candidatures);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContrat, setSelectedContrat] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // DE connecté de démonstration : Yacine Bensaid (DE-75-00123)
  const de = data.demandeursEmploi[0];

  const postulerEnUnClic = (offre) => {
    const deja = candidatures.some(c => c.offreId === offre.id);
    if (deja) return;

    const nouvelleCandidature = {
      id: Date.now(),
      offreId: offre.id,
      demandeurId: de.id,
      demandeurNom: `${de.prenom} ${de.nom}`,
      offreTitre: offre.intitule,
      entrepriseNom: offre.entrepriseNom,
      statut: 'recue',
      date: '12/10/2026',
      score: 95,
      lettre: 'Candidature spontanée via le portail mobile SalonEmploi Connect.',
    };

    setCandidatures([nouvelleCandidature, ...candidatures]);
    setToastMessage(`Félicitations ! Vous avez postulé à "${offre.intitule}". Votre agent référent a été notifié.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredOffres = data.offres.filter(o => {
    const matchSearch = o.intitule.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        o.entrepriseNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        o.competences.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchContrat = !selectedContrat || o.contrat === selectedContrat;
    return matchSearch && matchContrat && o.statut === 'publiee';
  });

  return (
    <div className="main-content" style={{ maxWidth: '1000px' }}>
      {/* Profil Header Mobile-First */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #0F172A 100%)', color: 'white', borderRadius: '16px', padding: '1.25rem', marginBottom: '1.25rem', boxShadow: '0 4px 15px rgba(30, 58, 138, 0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.15)', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>
              CANDIDAT ACTIF • {de.numeroDe}
            </span>
            <h2 style={{ color: 'white', marginTop: '0.35rem', fontSize: '1.4rem' }}>{de.prenom} {de.nom}</h2>
            <div style={{ fontSize: '0.85rem', color: '#CBD5E1', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
              <span><MapPin size={14} style={{ verticalAlign: 'middle' }} /> {de.ville}</span>
              <span>• Mobilité : {de.mobiliteKm} km</span>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.5rem 0.85rem', borderRadius: '10px', fontSize: '0.8rem' }}>
            <span style={{ color: '#93C5FD' }}>Agent Conseiller :</span>
            <div style={{ fontWeight: 600 }}>Marc Bernard (Pôle Numérique)</div>
          </div>
        </div>
      </div>

      {/* Barre de navigation mobile intuitive */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '4px' }}>
        <button 
          className={`btn btn-sm ${activeTab === 'offres' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('offres')}
        >
          <Briefcase size={15} /> Catalogue des Offres
        </button>
        <button 
          className={`btn btn-sm ${activeTab === 'candidatures' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('candidatures')}
        >
          <Clock size={15} /> Mes Candidatures & RDV ({candidatures.length})
        </button>
        <button 
          className={`btn btn-sm ${activeTab === 'profil' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('profil')}
        >
          <User size={15} /> Mon Profil & CV
        </button>
        <button 
          className={`btn btn-sm ${activeTab === 'rgpd' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('rgpd')}
        >
          <ShieldCheck size={15} /> Confidentialité (RGPD)
        </button>
      </div>

      {/* Toast de confirmation */}
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

      {/* 1. CATALOGUE DES OFFRES AVEC SCORING AUTOMATIQUE */}
      {activeTab === 'offres' && (
        <div>
          {/* Prochain Entretien Alert Card */}
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#2563EB', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={22} />
              </div>
              <div>
                <span className="badge badge-success">Prochain Entretien au Salon</span>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A', marginTop: '2px' }}>
                  NovaTech Solutions — 15 Nov 2026 à 09h30
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>Lieu : Stand A-01 (Présentiel)</div>
              </div>
            </div>
            <button className="btn btn-sm btn-primary">
              Voir la convocation
            </button>
          </div>

          {/* Filtres & Recherche rapide */}
          <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Rechercher un métier, une techno, une entreprise..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="form-select" 
                style={{ width: '160px' }}
                value={selectedContrat} 
                onChange={(e) => setSelectedContrat(e.target.value)}
              >
                <option value="">Tous Contrats</option>
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Interim">Intérim</option>
              </select>
            </div>
          </div>

          {/* Liste des cartes d'offres */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredOffres.map((offre) => {
              // Calcul simulé de matching
              const dejaPostule = candidatures.some(c => c.offreId === offre.id);
              const isMatchTop = offre.id === 1;
              const matchScore = isMatchTop ? 95 : (offre.id === 6 ? 88 : 62);

              return (
                <div key={offre.id} className="card" style={{ padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', color: '#0F172A', marginBottom: '0.2rem' }}>{offre.intitule}</h3>
                      <div style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                        {offre.entrepriseNom} • <span style={{ color: '#2563EB' }}>{offre.stand}</span>
                      </div>
                    </div>

                    {/* Badge de correspondance calculé pour lui */}
                    <div className={`match-score-badge ${matchScore >= 75 ? 'match-high' : 'match-medium'}`}>
                      <Sparkles size={14} />
                      {matchScore}% Compatible
                    </div>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: '#334155', marginBottom: '0.85rem' }}>
                    {offre.description}
                  </p>

                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <span className="badge badge-slate">{offre.contrat}</span>
                    <span className="badge badge-slate">{offre.niveau}</span>
                    <span className="badge badge-slate">{offre.ville}</span>
                    <span className="badge badge-slate">{offre.remuneration}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {offre.competences.map((c, i) => (
                        <span key={i} style={{ fontSize: '0.72rem', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '2px 6px', borderRadius: '4px' }}>
                          {c}
                        </span>
                      ))}
                    </div>

                    <button 
                      onClick={() => postulerEnUnClic(offre)}
                      disabled={dejaPostule}
                      className={`btn btn-sm ${dejaPostule ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ minWidth: '140px' }}
                    >
                      {dejaPostule ? (
                        <>✓ Déjà Postulé</>
                      ) : (
                        <><Send size={14} /> Postuler en 1 Clic</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. SUIVI DES CANDIDATURES ET TIMELINE */}
      {activeTab === 'candidatures' && (
        <div className="card">
          <div className="card-header">
            <h3>Mes Candidatures en Cours ({candidatures.length})</h3>
            <span className="badge badge-info">Suivi en direct</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {candidatures.map((c) => {
              const statuts = [
                { id: 'recue', label: 'Reçue' },
                { id: 'preselectionnee', label: 'Présélectionnée' },
                { id: 'entretien_programme', label: 'Entretien Fixé' },
                { id: 'retenue', label: 'Retenue' },
              ];

              return (
                <div key={c.id} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '1.25rem', background: '#FFFFFF' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <strong style={{ fontSize: '1rem', color: '#0F172A' }}>{c.offreTitre}</strong>
                      <div style={{ fontSize: '0.82rem', color: '#64748B' }}>{c.entrepriseNom} • Postulé le {c.date}</div>
                    </div>
                    <span className="badge badge-success">Score adéquation : {c.score}%</span>
                  </div>

                  {/* Timeline interactive */}
                  <div style={{ marginTop: '1rem', background: '#F8FAFC', padding: '0.85rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                      {statuts.map((s, index) => {
                        const isActive = s.id === c.statut || (c.statut === 'entretien_programme' && index <= 2) || (c.statut === 'retenue');
                        return (
                          <div key={s.id} style={{ textAlign: 'center', flex: 1 }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: isActive ? '#10B981' : '#CBD5E1',
                              color: 'white',
                              margin: '0 auto 4px auto',
                              fontSize: '0.75rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700
                            }}>
                              {isActive ? '✓' : index + 1}
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: isActive ? 700 : 500, color: isActive ? '#065F46' : '#64748B' }}>
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. MON PROFIL & CV */}
      {activeTab === 'profil' && (
        <div className="card">
          <div className="card-header">
            <h3>Mon Profil Professionnel & Curriculum Vitae</h3>
            <span className="badge badge-success">Profil Complété à 100%</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Numéro Demandeur d'Emploi</label>
              <input type="text" className="form-input" disabled defaultValue={de.numeroDe} />
            </div>

            <div className="form-group">
              <label className="form-label">Diplôme & Formation</label>
              <input type="text" className="form-input" defaultValue={de.filiere} />
            </div>

            <div className="form-group">
              <label className="form-label">Rayon de Mobilité Géographique</label>
              <select className="form-select" defaultValue={de.mobiliteKm}>
                <option value={10}>10 km autour de ma ville</option>
                <option value={20}>20 km (Recommandé)</option>
                <option value={35}>35 km</option>
                <option value={50}>50 km (Région Île-de-France)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mes Compétences Clés (utilisées par le matching)</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              {de.competences.map((c, i) => (
                <span key={i} className="badge badge-info" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                  {c} ✕
                </span>
              ))}
            </div>
          </div>

          {/* Zone de Téléversement de CV */}
          <div style={{ border: '2px dashed #93C5FD', background: '#EFF6FF', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', marginTop: '1.5rem' }}>
            <FileText size={40} color="#2563EB" style={{ margin: '0 auto 0.5rem auto' }} />
            <h4 style={{ color: '#1E3A8A' }}>Mon CV Actuel : {de.cvNom}</h4>
            <p style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem' }}>
              Format PDF certifié • Téléversé le 10/10/2026 (1.2 Mo)
            </p>
            <div style={{ marginTop: '0.85rem' }}>
              <button className="btn btn-sm btn-primary">
                <Upload size={14} /> Mettre à jour mon CV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. CONFIDENTIALITÉ & RGPD */}
      {activeTab === 'rgpd' && (
        <div className="card">
          <div className="card-header">
            <h3>Mes Données Personnelles & Conformité RGPD</h3>
            <span className="badge badge-success">Consentement Actif</span>
          </div>

          <div style={{ borderLeft: '4px solid #10B981', background: '#F0FDF4', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
            <strong style={{ color: '#065F46' }}>Consentement accordé le 12/10/2026</strong>
            <p style={{ fontSize: '0.85rem', color: '#047857', marginTop: '0.25rem' }}>
              Vos données sont uniquement utilisées pour l'organisation du salon, les mises en relation avec les 50 entreprises participantes et le suivi d'insertion professionnelle.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <h4>Droit à la Portabilité des Données</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>
                Vous pouvez exporter l'intégralité de votre dossier candidat au format normalisé JSON ou PDF.
              </p>
              <button 
                onClick={() => {
                  setToastMessage("Archive de vos données personnelles générée ! Téléchargement en cours.");
                }}
                className="btn btn-sm btn-secondary"
              >
                Télécharger mes données
              </button>
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
              <h4 style={{ color: '#DC2626' }}>Droit à l'Oubli & Suppression du Compte</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '0.5rem' }}>
                Conformément au RGPD, vous pouvez demander l'effacement de vos données après la tenue du salon.
              </p>
              <button 
                onClick={() => {
                  setToastMessage("Demande d'effacement enregistrée. Un agent de coordination traitera la demande sous 48h.");
                }}
                className="btn btn-sm btn-ghost" 
                style={{ color: '#DC2626', border: '1px solid #FCA5A5' }}
              >
                Demander la suppression de mon profil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
