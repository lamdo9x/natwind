import { useTheme } from '../../theme/theme-provider';
import * as DocumentPicker from 'expo-document-picker';
import { File, Image, X } from 'lucide-react-native';
import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { ScrollView, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Button, ButtonVariant } from './button';
import { Text } from './text';

export type FileType = 'image' | 'document' | 'all';

export interface SelectedFile {
  uri: string;
  name: string;
  type?: string;
  size?: number;
  mimeType?: string;
}

export interface FilePickerProps {
  onFilesSelected: (files: SelectedFile[]) => void;
  onError?: (error: string) => void;
  fileType?: FileType;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeBytes?: number;
  allowedExtensions?: string[];
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
  showFileInfo?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  variant?: ButtonVariant;
}

export interface FilePickerMethods {
  clearFiles: () => void;
  openPicker: () => void;
}

export const FilePicker = forwardRef<FilePickerMethods, FilePickerProps>(
  (
    {
      onFilesSelected,
      onError,
      fileType = 'all',
      multiple = false,
      maxFiles = 10,
      maxSizeBytes = 10 * 1024 * 1024,
      allowedExtensions,
      placeholder = 'Select files',
      disabled = false,
      style,
      showFileInfo = true,
      accessibilityLabel,
      accessibilityHint,
      variant = 'outline',
    },
    ref
  ) => {
    const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

    const tokens = useTheme();
    const mutedColor = tokens.mutedForeground;
    const primaryColor = tokens.primary;

    useImperativeHandle(ref, () => ({
      clearFiles: () => {
        setSelectedFiles([]);
        onFilesSelected([]);
      },
      openPicker: () => { handleDocumentPick(); },
    }));

    const validateFile = useCallback(
      (file: SelectedFile): string | null => {
        if (file.size && file.size > maxSizeBytes) {
          return `File size exceeds ${(maxSizeBytes / (1024 * 1024)).toFixed(1)}MB limit`;
        }
        if (allowedExtensions && allowedExtensions.length > 0) {
          const ext = file.name.split('.').pop()?.toLowerCase();
          if (!ext || !allowedExtensions.includes(ext)) {
            return `File type not allowed. Allowed: ${allowedExtensions.join(', ')}`;
          }
        }
        return null;
      },
      [maxSizeBytes, allowedExtensions]
    );

    const getMimeTypes = (): string[] => {
      switch (fileType) {
        case 'image': return ['image/*'];
        case 'document': return ['application/pdf', 'text/*', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        default: return ['*/*'];
      }
    };

    const handleDocumentPick = async () => {
      try {
        const result = await DocumentPicker.getDocumentAsync({
          type: getMimeTypes(),
          multiple,
          copyToCacheDirectory: true,
        });
        if (result.canceled) return;
        const assets = result.assets || [];
        const limitedAssets = multiple ? assets.slice(0, maxFiles) : assets.slice(0, 1);
        const newFiles: SelectedFile[] = [];
        for (const asset of limitedAssets) {
          const file: SelectedFile = { uri: asset.uri, name: asset.name, mimeType: asset.mimeType, size: asset.size };
          const error = validateFile(file);
          if (error) { onError?.(error); continue; }
          newFiles.push(file);
        }
        if (newFiles.length > 0) {
          const updated = multiple ? [...selectedFiles, ...newFiles] : newFiles;
          setSelectedFiles(updated);
          onFilesSelected(updated);
        }
      } catch {
        onError?.('Failed to pick file');
      }
    };

    const removeFile = (index: number) => {
      const updated = selectedFiles.filter((_, i) => i !== index);
      setSelectedFiles(updated);
      onFilesSelected(updated);
    };

    const formatFileSize = (bytes?: number): string => {
      if (!bytes) return '';
      if (bytes < 1024) return `${bytes} B`;
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
      <View style={style}>
        <Button
          variant={variant}
          onPress={handleDocumentPick}
          disabled={disabled}
          icon={fileType === 'image' ? Image : File}
          label={placeholder}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />

        {showFileInfo && selectedFiles.length > 0 && (
          <ScrollView className='mt-2 rounded-lg border border-border bg-muted max-h-48'>
            {selectedFiles.map((file, index) => (
              <View key={index} className='flex-row items-center p-3 gap-2.5 border-b border-border'>
                {fileType === 'image'
                  ? <Image size={16} color={primaryColor} />
                  : <File size={16} color={primaryColor} />
                }
                <View className='flex-1'>
                  <Text className='text-sm font-medium' numberOfLines={1}>{file.name}</Text>
                  {file.size && (
                    <Text className='text-xs mt-0.5' style={{ color: mutedColor }}>
                      {formatFileSize(file.size)}
                    </Text>
                  )}
                </View>
                <TouchableOpacity onPress={() => removeFile(index)} hitSlop={8}>
                  <X size={16} color={mutedColor} />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    );
  }
);

FilePicker.displayName = 'FilePicker';
