//
//  VSTextField.swift
//  Example
//
//  Created by Apple on 5/19/17.
//  Copyright © 2017 viral. All rights reserved.
//

import UIKit

@IBDesignable class VSTextField: UITextField {
    var leftImageView: UIImageView?
    var rightImageView: UIImageView?
    var paddingLeft = CGFloat(10)
    var paddingRight = CGFloat(30)
    override init(frame: CGRect) {
        super.init(frame: frame)
    }
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    @IBInspectable var leftImage: UIImage? = nil{
        didSet {
            if let leftImage = leftImage {
                if leftImageView == nil {
                    leftImageView = UIImageView()
                }
                leftImageView!.image = leftImage
                leftImageView!.contentMode = .center
                self.leftView = leftImageView!
                self.leftViewMode = UITextFieldViewMode.always
                leftImageView!.frame = CGRect(x: 0.0, y: 0.0, width: frame.size.height, height: frame.size.height)
                paddingLeft = frame.size.height
            }
            else {
                leftImageView?.removeFromSuperview()
                leftImageView = nil
                self.leftView = nil
                self.leftViewMode = UITextFieldViewMode.never
            }
        }
    }
    @IBInspectable var rightImage: UIImage? = nil{
        didSet {
            if let rightImage = rightImage {
                if rightImageView == nil {
                    rightImageView = UIImageView()
                }
                rightImageView!.image = rightImage
                rightImageView!.contentMode = .center
                self.rightView = rightImageView!
                self.rightViewMode = UITextFieldViewMode.always
                rightImageView!.frame = CGRect(x: 0.0, y: 0.0, width: frame.size.height, height: frame.size.height)
                paddingRight = frame.size.height
            }
            else {
                rightImageView?.removeFromSuperview()
                rightImageView = nil
                self.rightView = nil
                self.rightViewMode = UITextFieldViewMode.never
            }
        }
    }
    @IBInspectable var cornerRadius: CGFloat = 0 {
        didSet {
            layer.cornerRadius = cornerRadius
            layer.masksToBounds = true
        }
    }
    @IBInspectable var borderWidth: CGFloat = 0 {
        didSet {
            layer.borderWidth = borderWidth
            layer.masksToBounds = true
        }
    }
    @IBInspectable var borderColor: UIColor? {
        didSet {
            layer.borderColor = borderColor?.cgColor
        }
    }
    override func textRect(forBounds bounds: CGRect) -> CGRect {
        return CGRect(x: bounds.origin.x + paddingLeft , y: bounds.origin.y, width: bounds.width - (paddingLeft + paddingRight), height: bounds.height)
    }
    
    override func editingRect(forBounds bounds: CGRect) -> CGRect {
        return CGRect(x: bounds.origin.x + paddingLeft, y: bounds.origin.y, width: bounds.width - (paddingLeft + paddingRight), height: bounds.height)
    }
}
