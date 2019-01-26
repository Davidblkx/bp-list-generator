import { some } from '../helpers';
import { DbStatus, Post } from '../models';

export class BPDatabase {
  private _db: FirebaseFirestore.Firestore;
  private readonly _names = {
    status_collection: 'status',
    status_doc_id: 'last-status',
    posts_collection: 'bp-posts'
  };

  constructor(firestore: FirebaseFirestore.Firestore) {
    this._db = firestore;
  }

  /** load dabase status */
  public async getStatus(): Promise<DbStatus> {
    const statusDoc = this._db
      .collection(this._names.status_collection)
      .doc(this._names.status_doc_id);

    let docRef = await statusDoc.get();

    if (!docRef || !docRef.exists) {
      await statusDoc.set(<DbStatus> {
        totalFetch: 0,
        totalPages: 0
      });

      docRef = await statusDoc.get();
    }

    return some(docRef.data())
      .to<DbStatus>()
      .toPromise();
  }

  public async updateStatus(status: DbStatus) {
    await this._db
      .collection(this._names.status_collection)
      .doc(this._names.status_doc_id)
      .set(status);
  }

  public async savePosts(posts: Post[]) {
    const postDb = this._db.collection(this._names.posts_collection);
    for (const p of posts) {
      await postDb
        .doc(p.id)
        .set(p);
    }
  }
}
