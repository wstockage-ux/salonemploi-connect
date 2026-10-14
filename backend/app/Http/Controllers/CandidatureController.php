<?php

namespace App\Http\Controllers;

use App\Models\Candidature;
use App\Models\Offre;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CandidatureController extends Controller
{
    public function __construct(
        protected NotificationService $notificationService
    ) {}

    /**
     * Candidature en 1 clic par le demandeur d'emploi.
     */
    public function postuler(Request $request): JsonResponse
    {
        $user = $request->user();
        $de = $user->demandeurEmploi;

        if (!$de) {
            return response()->json(['success' => false, 'message' => 'Profil candidat introuvable.'], 403);
        }

        $validated = $request->validate([
            'offre_id'          => 'required|exists:offres,id',
            'lettre_motivation' => 'nullable|string',
        ]);

        // Vérification des doublons
        $dejaPostule = Candidature::where('offre_id', $validated['offre_id'])
            ->where('demandeur_emploi_id', $de->id)
            ->exists();

        if ($dejaPostule) {
            return response()->json([
                'success' => false,
                'message' => 'Vous avez déjà postulé à cette offre d emploi.',
            ], 422);
        }

        $offre = Offre::with('entreprise.utilisateur')->findOrFail($validated['offre_id']);

        if ($offre->statut !== 'publiee') {
            return response()->json([
                'success' => false,
                'message' => 'Cette offre n est plus ouverte aux candidatures.',
            ], 400);
        }

        $candidature = Candidature::create([
            'offre_id'            => $offre->id,
            'demandeur_emploi_id' => $de->id,
            'type_origine'        => 'spontanee',
            'lettre_motivation'   => $validated['lettre_motivation'] ?? $de->lettre_motivation_defaut,
            'statut'              => 'recue',
            'date_candidature'    => now(),
        ]);

        // Notification à l'entreprise
        if ($offre->entreprise?->utilisateur) {
            $this->notificationService->envoyer(
                $offre->entreprise->utilisateur,
                'in_app',
                'Nouvelle candidature reçue',
                "{$de->nom_complet} a postulé à votre offre '{$offre->intitule}'."
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Votre candidature a été transmise avec succès au recruteur.',
            'data'    => $candidature,
        ], 201);
    }

    /**
     * Liste des candidatures du DE connecté avec timeline.
     */
    public function mesCandidatures(Request $request): JsonResponse
    {
        $de = $request->user()->demandeurEmploi;

        $candidatures = Candidature::with(['offre.entreprise', 'entretiens'])
            ->where('demandeur_emploi_id', $de->id)
            ->orderBy('date_candidature', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $candidatures,
        ]);
    }

    /**
     * Mise à jour du statut par le recruteur (ou l'agent).
     */
    public function changerStatut(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'statut'      => 'required|in:recue,preselectionnee,entretien_programme,retenue,refusee',
            'motif_refus' => 'nullable|string',
        ]);

        $candidature = Candidature::with(['demandeurEmploi.utilisateur', 'offre'])->findOrFail($id);

        $candidature->update($validated);

        // Notification au candidat
        $userCandidat = $candidature->demandeurEmploi?->utilisateur;
        if ($userCandidat) {
            $libelles = [
                'preselectionnee'     => 'Votre candidature a été présélectionnée !',
                'entretien_programme' => 'Un créneau d entretien a été positionné.',
                'retenue'             => 'Félicitations ! Votre candidature est retenue.',
                'refusee'             => 'Mise à jour concernant votre candidature.',
            ];

            $titre = $libelles[$validated['statut']] ?? 'Statut de candidature mis à jour';
            $message = "Votre candidature pour le poste '{$candidature->offre->intitule}' est passée au statut : " . $validated['statut'];

            $this->notificationService->envoyer($userCandidat, 'email', $titre, $message);
        }

        return response()->json([
            'success' => true,
            'message' => 'Statut de candidature mis à jour.',
            'data'    => $candidature,
        ]);
    }
}
