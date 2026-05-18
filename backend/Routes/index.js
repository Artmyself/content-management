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
// router.get('/users/export', authMiddleware, rolePermission(['super_admin']), UserCtrl.exportCSV);
// router.post('/users/import', authMiddleware, rolePermission(['super_admin']), upload.single('file'), UserCtrl.importCSV);

router.get('/users', authMiddleware, rolePermission(['super_admin']), UserCtrl.list);
router.post('/users', authMiddleware, rolePermission(['super_admin']), UserCtrl.create);
router.put('/users/:id', authMiddleware, rolePermission(['super_admin']), UserCtrl.update);
router.delete('/users/:id', authMiddleware, rolePermission(['super_admin']), UserCtrl.remove);

// Artist
router.get('/artists', authMiddleware, rolePermission(['super_admin', 'artist_manager']), ArtistCtrl.list);
router.post('/artists', authMiddleware, rolePermission(['artist_manager']), ArtistCtrl.create);
router.get('/artists/export', authMiddleware, rolePermission(['artist_manager']), ArtistCtrl.exportCSV);
router.post('/artists/import', authMiddleware, rolePermission(['artist_manager']), upload.single('file'), ArtistCtrl.importCSV);

// Music
// router.get('/music/:artistId', authMiddleware, rolePermission(['super_admin', 'artist_manager', 'artist']), MusicCtrl.getByArtist);
router.post('/music', authMiddleware, rolePermission(['artist']), MusicCtrl.create);
router.put('/music/:id', authMiddleware, rolePermission(['artist']), MusicCtrl.update);
router.delete('/music/:id', authMiddleware, rolePermission(['artist']), MusicCtrl.remove);
export default router;