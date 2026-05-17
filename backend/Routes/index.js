import express from 'express';
import multer from 'multer';
import { authMiddleware } from '../feature/Auth/Middleware/AuthMiddleware.js';
import { rolePermission } from '../lib/Middleware/rolePermission.js';

import * as AuthCtrl from '../feature/Auth/AuthController.js';
import * as UserCtrl from '../feature/Users/UserController.js';
import * as ArtistCtrl from '../feature/Artist/ArtistController.js';
import * as MusicCtrl from '../feature/Music/MusicController.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Auth
router.post('/auth/register', AuthCtrl.register);
router.post('/auth/login', AuthCtrl.login);

// Users
router.get('/users', authMiddleware, rolePermission(['super_admin']), UserCtrl.list);

// Artist
router.get('/artists', authMiddleware, rolePermission(['super_admin', 'artist_manager']), ArtistCtrl.list);
router.get('/artists/export', authMiddleware, rolePermission(['artist_manager']), ArtistCtrl.exportCSV);
router.post('/artists/import', authMiddleware, rolePermission(['artist_manager']), upload.single('file'), ArtistCtrl.importCSV);

// Music
router.get('/music/:artistId', authMiddleware, MusicCtrl.getByArtist);
router.post('/music', authMiddleware, rolePermission(['artist']), MusicCtrl.create);

export default router;