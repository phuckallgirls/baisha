export interface ServerConfig {
  port: number;
  host: string;
  env: string;
}

export interface DatabaseConfig {
  uri: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface UploadConfig {
  maxSize: number;
  allowedTypes: string[];
  dir: string;
}

export interface CacheConfig {
  ttl: number;
  checkPeriod: number;
}

export interface PaginationConfig {
  defaultPage: number;
  defaultLimit: number;
  maxLimit: number;
}

export interface CryptoConfig {
  saltRounds: number;
}

export interface CorsConfig {
  origin: string;
  methods: string[];
  allowedHeaders: string[];
}

export interface AppConfig {
  server: ServerConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
  upload: UploadConfig;
  cache: CacheConfig;
  pagination: PaginationConfig;
  crypto: CryptoConfig;
  cors: CorsConfig;
} 