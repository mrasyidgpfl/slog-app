class DatabaseRouter:
    """
    A router to control all database operations on models.
    """

    def db_for_read(self, model, **hints):
        """
        Attempts to read models go to read database.
        """
        return 'read'

    def db_for_write(self, model, **hints):
        """
        Attempts to write models go to write database.
        """
        return 'default'

    def allow_relation(self, obj1, obj2, **hints):
        """
        Allow any relation if both models are in the same database.
        """
        db_obj1 = hints.get('instance', obj1)._state.db
        db_obj2 = hints.get('instance', obj2)._state.db
        if db_obj1 and db_obj2:
            return db_obj1 == db_obj2
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """
        Make sure the auth app only appears in the 'default' database.
        """
        if app_label == 'auth':
            return db == 'default'
        return None
