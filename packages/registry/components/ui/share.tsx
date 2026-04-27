import { Share2 } from 'lucide-react-native';
import React, { useCallback, useMemo } from 'react';
import { Alert, Platform, Share as RNShare, View, ViewStyle } from 'react-native';
import { Button, ButtonVariant } from './button';

export interface ShareContent {
  message?: string;
  url?: string;
  title?: string;
  subject?: string;
}

export interface ShareButtonOptions {
  dialogTitle?: string;
  excludedActivityTypes?: string[];
  tintColor?: string;
  anchor?: number;
}

export interface ShareButtonProps {
  content: ShareContent;
  options?: ShareButtonOptions;
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  onShareStart?: () => void;
  onShareSuccess?: (activityType?: string | null) => void;
  onShareError?: (error: Error) => void;
  onShareDismiss?: () => void;
  showIcon?: boolean;
  validateContent?: boolean;
  style?: ViewStyle;
}

function isValidUrl(url: string): boolean {
  try { new URL(url); return true; } catch { return false; }
}

export function ShareButton({
  content,
  options,
  children,
  variant = 'default',
  size = 'default',
  disabled = false,
  loading = false,
  onShareStart,
  onShareSuccess,
  onShareError,
  onShareDismiss,
  showIcon = true,
  validateContent = true,
  style,
}: ShareButtonProps) {
  const isContentValid = useMemo(() => {
    if (!validateContent) return true;
    if (!content.message && !content.url) return false;
    if (content.url && !isValidUrl(content.url)) return false;
    return true;
  }, [content, validateContent]);

  const handleShare = useCallback(async () => {
    if (!isContentValid) {
      onShareError?.(new Error('Invalid share content'));
      Alert.alert('Share Error', 'Cannot share: invalid content provided');
      return;
    }
    try {
      onShareStart?.();
      const shareContent: any = {};
      if (content.message) shareContent.message = content.message;
      if (content.url) shareContent.url = content.url;
      if (Platform.OS === 'ios') {
        if (content.title) shareContent.title = content.title;
        if (content.subject) shareContent.subject = content.subject;
      }
      const shareOptions: any = {};
      if (Platform.OS === 'android' && options?.dialogTitle) shareOptions.dialogTitle = options.dialogTitle;
      if (Platform.OS === 'ios' && options?.excludedActivityTypes) shareOptions.excludedActivityTypes = options.excludedActivityTypes;

      const result = await RNShare.share(shareContent, shareOptions);
      if (result.action === RNShare.sharedAction) {
        onShareSuccess?.(result.activityType);
      } else if (result.action === RNShare.dismissedAction) {
        onShareDismiss?.();
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      onShareError?.(err);
    }
  }, [content, options, isContentValid, onShareStart, onShareSuccess, onShareError, onShareDismiss]);

  return (
    <View style={style}>
      <Button
        variant={variant}
        size={size}
        disabled={disabled || !isContentValid}
        loading={loading}
        onPress={handleShare}
        icon={showIcon ? Share2 : undefined}
        label={typeof children === 'string' ? children : undefined}
      >
        {typeof children !== 'string' ? children : undefined}
      </Button>
    </View>
  );
}
