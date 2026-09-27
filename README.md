# Chowoljoa (초월조아)

A Django application for Lost Ark transcendence probability calculations, with Korean and English interfaces. The calculator evaluates tablet paths and uses a precomputed expectation table. Contact submissions are stored in SQLite and managed through Django admin.

You can test Chowoljoa [here](https://shallwe-dance.github.io/chowoljoa/ko/)

## Local development

Use Python 3.10 or newer. From the repository root:

```sh
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cd myproject
mkdir -p logs
python manage.py migrate
python manage.py runserver
```

Open http://127.0.0.1:8000/ko/ or http://127.0.0.1:8000/en/. The root URL currently redirects to the production domain. Run `python manage.py createsuperuser` to access `/admin/`.

## Project layout

- `myproject/myapp/logic.py`: tablet traversal and probability calculations.
- `myproject/myapp/expectations.csv`: precomputed expectations used by the API.
- `myproject/myapp/templates/` and `myproject/myapp/static/`: pages and source assets.
- `myproject/myapp/models.py`: contact submissions.
- `myproject/myproject/settings/`: shared, local, and production settings.

The optional `myapp/expectations.py` script regenerates the expectation table using random sampling. Install `tqdm` separately and run it from `myproject/myapp/`; it overwrites `expectations.csv`, so do not run it during normal setup.

## Validation and deployment

From `myproject/`, run `python manage.py check` and `python manage.py test`.

Deploy with a Python WSGI/ASGI application server and a reverse proxy. This application requires a backend and cannot run on GitHub Pages. Review the production hostnames, secret key, database, media storage, and logging configuration before deployment. Create the `logs/` directory and run migrations and `collectstatic` with the production settings.

Keep virtual environments, database files, uploaded media, logs, private keys, and generated static files out of version control. Existing local runtime data is not part of the source distribution.
