# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.user import User  # noqa
from app.models.portfolio import Portfolio, Position, Trade  # noqa
from app.models.signal import Signal  # noqa
from app.models.subscription import Subscription  # noqa
