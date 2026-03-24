# ── Build stage ───────────────────────────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /build

# Install dependencies into a separate layer for caching
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /install /usr/local

# Copy your ml/ project files
COPY . .

# Create data dir for SQLite feedback db
RUN mkdir -p /app/data

# Non-root user for security
RUN adduser --disabled-password --gecos "" wdig
USER wdig

EXPOSE 8000

# Production: gunicorn managing 4 uvicorn workers
# Adjust -w based on your server's CPU count (2 × cores + 1 is a common rule)
CMD ["gunicorn", "app:app", \
     "-w", "4", \
     "-k", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000", \
     "--timeout", "120", \
     "--graceful-timeout", "10", \
     "--access-logfile", "-", \
     "--error-logfile", "-"]
