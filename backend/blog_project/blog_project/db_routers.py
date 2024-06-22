class DatabaseRouter:
    def db_for_read(self, model, **hints):
        return 'default'  # Use 'default' database for read operations

    def db_for_write(self, model, **hints):
        return 'write'  # Use 'write' database for write operations

    def allow_relation(self, obj1, obj2, **hints):
        # Allow relations between objects in different databases if needed
        return True

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        # Allow migrations on all databases
        return True
