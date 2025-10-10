// Ajoute le zoom sur hover/click pour les images de projet

document.addEventListener('DOMContentLoaded', function () {
    // Fonction pour initialiser le zoom sur les images
    function initializeThumbnailZoom() {
        // Sélectionne toutes les images de projet
        const thumbnails = document.querySelectorAll('.main-thumbnail');
        console.log('Found thumbnails:', thumbnails.length);

        if (thumbnails.length === 0) {
            // Si aucun thumbnail n'est trouvé, réessayer après un délai
            setTimeout(initializeThumbnailZoom, 500);
            return;
        }

        // Crée l'overlay une seule fois
        let overlay = document.createElement('div');
        overlay.className = 'thumbnail-zoom-overlay';
        document.body.appendChild(overlay);

        thumbnails.forEach(function (img) {
            // Sauvegarde les propriétés originales de l'image
            img.style.cursor = 'zoom-in';

            // Ajoute l'effet de zoom au hover
            img.addEventListener('mouseenter', function () {
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'transform 0.3s ease';
            });

            img.addEventListener('mouseleave', function () {
                this.style.transform = 'scale(1)';
            });

            img.addEventListener('click', function (e) {
                e.stopPropagation();

                // Clone l'image pour l'afficher dans l'overlay
                const zoomedImg = this.cloneNode(true);
                zoomedImg.className = 'thumbnail-zoomed';
                zoomedImg.style.cursor = 'zoom-out';

                // Ajoute l'image clonée à l'overlay
                overlay.appendChild(zoomedImg);
                overlay.classList.add('active');

                // Ferme le zoom au clic sur l'overlay ou sur l'image zoomée
                const closeZoom = function () {
                    overlay.removeChild(zoomedImg);
                    overlay.classList.remove('active');
                    document.removeEventListener('click', handleDocumentClick);
                    overlay.removeEventListener('click', closeZoom);
                };

                const handleDocumentClick = function (e) {
                    if (e.target === overlay) {
                        closeZoom();
                    }
                };

                // Ferme le zoom avec la touche Échap
                const handleKeyPress = function (e) {
                    if (e.key === 'Escape') {
                        closeZoom();
                        document.removeEventListener('keydown', handleKeyPress);
                    }
                };

                // Ferme aussi au clic sur l'image zoomée
                zoomedImg.addEventListener('click', function (e) {
                    e.stopPropagation();
                    closeZoom();
                });

                overlay.addEventListener('click', closeZoom);
                document.addEventListener('click', handleDocumentClick);
                document.addEventListener('keydown', handleKeyPress);

                // Empêche la fermeture immédiate en cliquant sur l'image elle-même
                this.addEventListener('click', function (e) {
                    e.stopPropagation();
                });
            });
        });
    }

    // Démarre l'initialisation
    initializeThumbnailZoom();
});
