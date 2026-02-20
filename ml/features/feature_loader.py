"""
Feature loading from database and CSV sources
"""
import pandas as pd
import sqlite3
from pathlib import Path
from typing import Tuple, Optional
from utils.config import TRAIT_COLUMNS, DB_PATH, CSV_PATH
from utils.logger import logger

class FeatureLoader:
    """
    Loads and manages feature data from various sources
    """
    
    def __init__(self, db_path: Path = DB_PATH):
        """
        Initialize feature loader
        
        Args:
            db_path: Path to SQLite database
        """
        self.db_path = db_path
        self.trait_columns = TRAIT_COLUMNS
    
    def load_from_csv(self, csv_path: Path = CSV_PATH) -> pd.DataFrame:
        """
        Load training data from CSV file
        
        Args:
            csv_path: Path to CSV file
        
        Returns:
            DataFrame with trait data
        """
        try:
            df = pd.read_csv(csv_path)
            logger.info(f"Loaded {len(df)} samples from CSV: {csv_path}")
            
            # Validate columns
            required_cols = set(self.trait_columns + ["confidence"])
            if not required_cols.issubset(df.columns):
                missing = required_cols - set(df.columns)
                raise ValueError(f"Missing required columns: {missing}")
            
            return df
        
        except FileNotFoundError:
            logger.error(f"CSV file not found: {csv_path}")
            raise
        except Exception as e:
            logger.error(f"Error loading CSV: {e}")
            raise
    
    def load_from_database(self, 
                          table_name: str = 'ml_training_vectors',
                          limit: Optional[int] = None) -> pd.DataFrame:
        """
        Load training data from database
        
        Args:
            table_name: Name of the database table
            limit: Optional limit on number of rows
        
        Returns:
            DataFrame with trait data
        """
        try:
            if not self.db_path.exists():
                logger.warning(f"Database not found: {self.db_path}")
                return pd.DataFrame()
            
            conn = sqlite3.connect(self.db_path)
            
            query = f"SELECT * FROM {table_name}"
            if limit:
                query += f" LIMIT {limit}"
            
            df = pd.read_sql_query(query, conn)
            conn.close()
            
            logger.info(f"Loaded {len(df)} samples from database table: {table_name}")
            return df
        
        except Exception as e:
            logger.error(f"Error loading from database: {e}")
            raise
    
    def load_user_snapshot(self, user_id: str, test_id: Optional[str] = None) -> pd.DataFrame:
        """
        Load a specific user's trait snapshot
        
        Args:
            user_id: User identifier
            test_id: Optional test identifier
        
        Returns:
            DataFrame with user's trait data
        """
        try:
            conn = sqlite3.connect(self.db_path)
            
            if test_id:
                query = f"""
                    SELECT * FROM ml_trait_snapshot 
                    WHERE user_id = ? AND test_id = ?
                """
                df = pd.read_sql_query(query, conn, params=(user_id, test_id))
            else:
                query = f"""
                    SELECT * FROM ml_trait_snapshot 
                    WHERE user_id = ?
                    ORDER BY created_at DESC
                    LIMIT 1
                """
                df = pd.read_sql_query(query, conn, params=(user_id,))
            
            conn.close()
            
            if len(df) > 0:
                logger.info(f"Loaded snapshot for user {user_id}")
            else:
                logger.warning(f"No snapshot found for user {user_id}")
            
            return df
        
        except Exception as e:
            logger.error(f"Error loading user snapshot: {e}")
            raise
    
    def load_training_data(self, 
                          source: str = 'csv',
                          limit: Optional[int] = None) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Load training data and separate features from confidence
        
        Args:
            source: Data source ('csv' or 'database')
            limit: Optional limit on number of samples
        
        Returns:
            Tuple of (features DataFrame, confidence Series)
        """
        if source == 'csv':
            data = self.load_from_csv()
        elif source == 'database':
            data = self.load_from_database(limit=limit)
        else:
            raise ValueError(f"Unknown source: {source}")
        
        if data.empty:
            logger.error("No training data loaded")
            raise ValueError("No training data available")
        
        # Separate features and confidence
        features = data[self.trait_columns]
        confidence = data['confidence'] if 'confidence' in data.columns else None
        
        logger.info(f"Prepared {len(features)} training samples with {len(self.trait_columns)} features")
        
        return features, confidence
    
    def get_feature_statistics(self, data: pd.DataFrame) -> dict:
        """
        Calculate basic statistics for features
        
        Args:
            data: Feature DataFrame
        
        Returns:
            Dictionary with statistics
        """
        stats = {
            'n_samples': len(data),
            'n_features': len(self.trait_columns),
            'feature_means': data[self.trait_columns].mean().to_dict(),
            'feature_stds': data[self.trait_columns].std().to_dict(),
            'feature_mins': data[self.trait_columns].min().to_dict(),
            'feature_maxs': data[self.trait_columns].max().to_dict(),
        }
        
        logger.info(f"Calculated statistics for {stats['n_samples']} samples")
        return stats
    
    def save_to_database(self, 
                        data: pd.DataFrame, 
                        table_name: str = 'ml_training_vectors'):
        """
        Save data to database
        
        Args:
            data: DataFrame to save
            table_name: Target table name
        """
        try:
            conn = sqlite3.connect(self.db_path)
            data.to_sql(table_name, conn, if_exists='append', index=False)
            conn.close()
            
            logger.info(f"Saved {len(data)} samples to database table: {table_name}")
        
        except Exception as e:
            logger.error(f"Error saving to database: {e}")
            raise
